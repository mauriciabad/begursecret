import { MetadataRoute } from 'next'
import { env } from '~/env.mjs'
import { MAX_IMPORTANCE } from '~/server/db/constants/shared'
import { db } from '~/server/db/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const places = await db.query.places.findMany({
    columns: { id: true, importance: true },
  })
  const routes = await db.query.routes.findMany({
    columns: { id: true, importance: true },
  })

  return [
    {
      url: `${env.BASE_URL}/`,
      priority: 1,
    },
    {
      url: `${env.BASE_URL}/explore`,
      priority: 0.9,
    },
    {
      url: `${env.BASE_URL}/missions`,
      priority: 0.9,
    },
    {
      url: `${env.BASE_URL}/profile`,
      priority: 0.9,
    },

    ...places.map((place) => ({
      url: `${env.BASE_URL}/explore/places/${place.id}`,
      priority: 0.8 + importanceToDecimal(place.importance) * 0.01,
    })),

    ...routes.map((route) => ({
      url: `${env.BASE_URL}/explore/routes/${route.id}`,
      priority: 0.8 + importanceToDecimal(route.importance) * 0.01,
    })),
  ]
}

function importanceToDecimal(importance: number | null): number {
  return (MAX_IMPORTANCE - (importance ?? MAX_IMPORTANCE)) / MAX_IMPORTANCE
}
