import 'server-only'

import { calculatePath } from '~/helpers/spatial-data/multi-line'
import { calculateLocation } from '~/helpers/spatial-data/point'
import { db } from '~/server/db/db'
import { places, routes } from '~/server/db/schema'
import { selectMultiLine } from '~/server/helpers/spatial-data/multi-line'
import { selectPoint } from '~/server/helpers/spatial-data/point'
import { publicProcedure, router } from '~/server/trpc'

const getAllPlacesForMap = db.query.places
  .findMany({
    columns: {
      id: true,
      name: true,
      importance: true,
    },
    extras: {
      location: selectPoint('location', places.location),
    },
    with: {
      mainCategory: {
        columns: {
          id: true,
          icon: true,
          color: true,
        },
      },
    },
  })
  .prepare('map/getAllPlacesForMap')

const getAllRoutesForMap = db.query.routes
  .findMany({
    columns: {
      id: true,
      name: true,
      importance: true,
    },
    extras: {
      path: selectMultiLine('path', routes.path),
    },
    with: {
      mainCategory: {
        columns: {
          id: true,
          icon: true,
          color: true,
        },
      },
    },
  })
  .prepare('map/getAllRoutesForMap')

export const mapRouter = router({
  getAllPlaces: publicProcedure.query(async () => {
    return (await getAllPlacesForMap.execute()).map(calculateLocation)
  }),
  getAllRoutes: publicProcedure.query(async () => {
    return (await getAllRoutesForMap.execute()).map(calculatePath)
  }),
})
