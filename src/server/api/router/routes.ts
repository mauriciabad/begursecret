import 'server-only'

import { calculatePath } from '~/helpers/spatial-data/multi-line'
import { db } from '~/server/db/db'
import { routes } from '~/server/db/schema'
import { selectMultiLine } from '~/server/helpers/spatial-data/multi-line'
import { publicProcedure, router } from '~/server/trpc'

const getAllRoutesForMap = db.query.routes
  .findMany({
    columns: {
      id: true,
      name: true,
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
  .prepare()

export const routesRouter = router({
  listForMap: publicProcedure.query(async () => {
    return (await getAllRoutesForMap.execute()).map(calculatePath)
  }),
})
