import type { Metadata } from 'next'
import { getTranslator } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { FC } from 'react'
import { LocaleParams, onlyTranslatableLocales } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { OverrideMainMap } from '../../_components/override-main-map'
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
  if (!place) notFound()

  const visitMissions = await trpc.missions.getVisitMissions({
    locale: onlyTranslatableLocales(params.locale),
    placeId,
  })

  return (
    <>
      <OverrideMainMap center={place.location} zoom={18} />
      <PlaceDetails placeFullInfo={place} visitMissions={visitMissions} />
    </>
  )
}

export default PlacePage
