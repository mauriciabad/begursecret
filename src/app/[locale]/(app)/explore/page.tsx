'use client' // TODO: Make this a server component

// import type { Metadata } from 'next'
import { useLocale, useTranslations } from 'next-intl'
// import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { onlyTranslatableLocales, type LocaleRouteParams } from '~/i18n'
import { trpc } from '~/trpc'
import { Map } from '~/components/map/map'

// export async function generateMetadata({
//   params,
// }: LocaleRouteParams): Promise<Metadata> {
//   const t = await getTranslator(params.locale, 'explore')
//   return {
//     title: t('meta.title'),
//     description: t('meta.description'),
//   }
// }

const ExplorePage: FC<LocaleRouteParams> = () => {
  const t = useTranslations('explore.list')
  const locale = useLocale()
  const placesQuery = trpc.places.list.useQuery({
    locale: onlyTranslatableLocales(locale),
  })

  if (placesQuery.status !== 'success') {
    return (
      <div className="flex grow items-center justify-center rounded border border-gray-200 bg-gray-200 px-4 py-2 text-lg">
        {t('loading')}
      </div>
    )
  }

  const places = placesQuery.data

  return (
    <>
      <Map
        className="grow"
        fullControl
        zoom={14}
        markers={places.map((place) => ({
          text: place.name,
          location: place.location,
          markerType: 'beach',
        }))}
      />

      {/* 
      <aside className="pointer-events-none absolute inset-x-0 top-0">
        <div className="mx-auto max-w-2xl px-6 py-3">
          <PlaceList places={places} />
        </div>
      </aside> 
      */}
    </>
  )
}

export default ExplorePage
