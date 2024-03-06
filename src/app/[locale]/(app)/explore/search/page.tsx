import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import { LocaleRouteParams, onlyTranslatableLocales, parseLocale } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { OverrideMainMap } from '../_components/override-main-map'
import { PlaceList } from '../_components/place-list'

type PageParams = LocaleRouteParams & {
  searchParams: {
    category: string
  }
}
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const t = await getTranslations({
    locale: params.locale,
    namespace: 'explore.search',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const ExplorePage: FC<PageParams> = async ({ params, searchParams }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const trpc = await getTrpc()
  const places = await trpc.places.search({
    locale: onlyTranslatableLocales(locale),
    category: Number(searchParams.category),
  })

  const placeIds = new Set(places.map((place) => place.id))

  return (
    <>
      <OverrideMainMap emphasizedMarkers={placeIds} />
      <PlaceList places={places} />
    </>
  )
}

export default ExplorePage
