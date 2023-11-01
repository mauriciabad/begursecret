import type { Metadata } from 'next'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { Map } from '~/components/map/map'
import { cn } from '~/helpers/cn'
import { LocaleParams, onlyTranslatableLocales } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { MapDrawer } from '../../_components/map-drawer'
import { PlaceDetails } from '../../_components/place-details'

type Params = LocaleParams & { placeId: string }

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'place')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const PlacePage: FC<{
  params: Params
}> = async ({ params }) => {
  const placeId = Number(params.placeId)

  const trpc = await getTrpc()
  const place = await trpc.places.get({
    locale: onlyTranslatableLocales(params.locale),
    id: placeId,
  })

  return (
    <>
      <Map
        className={cn(
          'min-h-[calc(100dvh_-_192px)]',
          'sticky top-16 grow',
          '-mb-2 box-content pb-2'
        )}
        classNames={{
          controls: 'bottom-6',
        }}
        fullControl
        zoom={18}
        center={place.location}
        markers={[
          {
            location: place.location,
            markerType: 'beach',
          },
        ]}
      />

      <MapDrawer
        classNames={{
          wrapper: 'rounded-t-lg',
        }}
      >
        <PlaceDetails placeFullInfo={place} />
      </MapDrawer>
    </>
  )
}

export default PlacePage
