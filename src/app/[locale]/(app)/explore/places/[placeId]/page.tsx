import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type FC } from 'react'
import { makeImageUrl } from '~/helpers/images'
import { LocaleRouteParams, locales, onlyTranslatableLocales } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { OverrideMainMap } from '../../_components/override-main-map'
import { PlaceDetails } from '../../_components/place-details'

type Params = LocaleRouteParams<{ placeId: string }>

export async function generateMetadata({
  params: { locale, placeId },
}: Params): Promise<Metadata> {
  const trpc = await getTrpc()
  const place = await trpc.metadata.place({
    locale: onlyTranslatableLocales(locale),
    id: Number(placeId),
  })
  if (!place) return {}

  const title = `${place.name}`
  const categoriesList = [
    place.mainCategory.namePlural,
    ...place.categories.map((c) => c.category.namePlural),
  ]
  const description = `${place.description} | ${categoriesList.join(', ')}`
  const alternates = Object.fromEntries(
    locales.map((l) => [l, `/${l}/explore/places/${placeId}`])
  )

  // Wait 4 seconds
  await new Promise((resolve) => setTimeout(resolve, 4000))

  return {
    title,
    description,
    alternates: {
      canonical: `/explore/places/${placeId}`,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: alternates[locale],
      siteName: 'Begur Secret',
      images: place.mainImage
        ? {
            url: makeImageUrl(place.mainImage.key),
            width: place.mainImage.width,
            height: place.mainImage.height,
            alt: place.mainImage.alt ?? undefined,
          }
        : undefined,
      locale,
      type: 'article',
      // modifiedTime: place.updatedAt,
      // publishedTime: place.updatedAt,
      authors: 'Begur Secret',
      tags: [...categoriesList, 'begur', 'costa-brava', 'baix-emporda'],
      section: place.mainCategory.namePlural,
    },
  }
}

const PlacePage: FC<Params> = async ({ params }) => {
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

  const veryEmphasizedMarkers = new Set([placeId])

  return (
    <>
      <OverrideMainMap
        center={place.location}
        zoom={18}
        veryEmphasizedMarkers={veryEmphasizedMarkers}
      />
      <PlaceDetails place={place} visitMissions={visitMissions} />
    </>
  )
}

export default PlacePage
