import type { Metadata } from 'next'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { Map } from '~/components/map/map'
import { onlyTranslatableLocales, LocaleParams } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'

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
        className="grow"
        fullControl
        zoom={19}
        center={place.location}
        markers={[
          {
            text: place.name,
            location: place.location,
            markerType: 'beach',
          },
        ]}
      />
    </>
  )
}

export default PlacePage
