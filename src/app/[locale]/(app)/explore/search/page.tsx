import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import { sortByImportanceRanzomIfEqual } from '~/helpers/sortBy'
import { LocaleRouteParams, onlyTranslatableLocales, parseLocale } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { OverrideMainMap } from '../_components/override-main-map'
import { PlaceList } from './_components/place-list'

type PageParams = LocaleRouteParams & {
  searchParams: {
    placeCategory?: string
    routeCategory?: string
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
  const places = await trpc.search.places({
    locale: onlyTranslatableLocales(locale),
    placeCategory: searchParams.placeCategory
      ? Number(searchParams.placeCategory)
      : null,
  })
  const routes = await trpc.search.routes({
    locale: onlyTranslatableLocales(locale),
    routeCategory: searchParams.routeCategory
      ? Number(searchParams.routeCategory)
      : null,
  })

  const placeIds = new Set(places.map((place) => place.id))
  const routeIds = new Set(routes.map((route) => route.id))

  return (
    <>
      <OverrideMainMap
        emphasizedMarkers={placeIds}
        veryEmphasizedLines={routeIds}
      />
      <PlaceList
        items={[
          ...places
            .map((place) => ({ type: 'place' as const, ...place }))
            .sort(sortByImportanceRanzomIfEqual),
          ...routes
            .map((route) => ({ type: 'route' as const, ...route }))
            .sort(sortByImportanceRanzomIfEqual),
        ]}
      />
    </>
  )
}

export default ExplorePage
