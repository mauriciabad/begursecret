import type { Metadata } from 'next'
import { useLocale } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { Map } from '~/components/map/map'
import { onlyTranslatableLocales, type LocaleRouteParams } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { MapDrawer } from './_components/map-drawer'
import { PlaceList } from './_components/place-list'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'explore')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const ExplorePage: FC<LocaleRouteParams> = async () => {
  const locale = useLocale()
  const trpc = await getTrpc()
  const places = await trpc.places.list({
    locale: onlyTranslatableLocales(locale),
  })

  return (
    <>
      <Map
        className="grow basis-[calc(100dvh_-_256px)]"
        fullControl
        zoom={14}
        markers={places.map((place) => ({
          location: place.location,
          markerType: 'beach',
          url: `/explore/places/${place.id}`,
        }))}
      />

      <MapDrawer>
        <PlaceList places={places} />
      </MapDrawer>
    </>
  )
}

export default ExplorePage
