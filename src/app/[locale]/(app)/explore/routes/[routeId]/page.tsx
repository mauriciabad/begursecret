import type { Metadata } from 'next'
import { unstable_setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { type FC } from 'react'
import { makeImageUrl } from '~/helpers/images'
import {
  LocaleRouteParams,
  locales,
  onlyTranslatableLocales,
  parseLocale,
} from '~/i18n'
import { db } from '~/server/db/db'
import { getTrpc } from '~/server/get-server-thing'
import { OverrideMainMap } from '../../_components/override-main-map'
import { RouteDetails } from '../../_components/route-details'

type Params = LocaleRouteParams<{ routeId: string }>

export async function generateStaticParams() {
  const queryResult = await db.query.routes.findMany({
    columns: { id: true },
  })
  return queryResult.map((route) => ({
    routeId: String(route.id),
  }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = parseLocale(params.locale)
  const routeId = Number(params.routeId)
  const trpc = await getTrpc()
  const route = await trpc.metadata.route({
    locale: onlyTranslatableLocales(locale),
    id: routeId,
  })
  if (!route) return {}

  const title = `${route.name}`
  const categoriesList = [
    route.mainCategory.namePlural,
    ...route.categories.map((c) => c.category.namePlural),
  ]
  const description = `${route.description} | ${categoriesList.join(', ')}`
  const alternates = Object.fromEntries(
    locales.map((l) => [l, `/${l}/explore/routes/${routeId}`])
  )

  return {
    title,
    description,
    alternates: {
      canonical: `/explore/routes/${routeId}`,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: alternates[locale],
      siteName: 'Begur Secret',
      images: route.mainImage
        ? {
            url: makeImageUrl(route.mainImage.key),
            width: route.mainImage.width,
            height: route.mainImage.height,
            alt: route.mainImage.alt ?? undefined,
          }
        : undefined,
      locale,
      type: 'article',
      // modifiedTime: route.updatedAt,
      // publishedTime: route.updatedAt,
      authors: 'Begur Secret',
      tags: [...categoriesList, 'begur', 'costa-brava', 'baix-emporda'],
      section: route.mainCategory.namePlural,
    },
  }
}

const RoutePage: FC<Params> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const routeId = Number(params.routeId)

  const trpc = await getTrpc()
  const route = await trpc.routes.get({
    locale: onlyTranslatableLocales(params.locale),
    id: routeId,
  })
  if (!route) notFound()

  const veryEmphasizedLines = new Set([routeId])

  const routeCenter = route.path[0][0]

  return (
    <>
      <OverrideMainMap
        center={{
          lat: routeCenter[0],
          lng: routeCenter[1],
        }}
        zoom={16}
        veryEmphasizedLines={veryEmphasizedLines}
      />
      <RouteDetails route={route} />
    </>
  )
}

export default RoutePage
