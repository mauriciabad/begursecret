import type { Metadata } from 'next'
import { useLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import { LocaleParams, onlyTranslatableLocales } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { OverrideMainMap } from '../_components/override-main-map'
import { PlaceList } from '../_components/place-list'

type PageParams = {
  params: LocaleParams
  searchParams: {
    category: string
  }
}
export async function generateMetadata({
  params: { locale },
}: PageParams): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'explore',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const ExplorePage: FC<PageParams> = async ({ searchParams }) => {
  const locale = useLocale()
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
