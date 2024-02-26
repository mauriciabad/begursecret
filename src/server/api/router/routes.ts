import { sql } from 'drizzle-orm'
import 'server-only'

import { calculatePath } from '~/helpers/spatial-data/multi-line'
import { getRoutesSchema } from '~/schemas/routes'
import { db } from '~/server/db/db'
import { routes } from '~/server/db/schema'
import { ascNullsEnd } from '~/server/helpers/order-by'
import { selectMultiLine } from '~/server/helpers/spatial-data/multi-line'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { publicProcedure, router } from '~/server/trpc'

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
  .prepare()

const getRoute = flattenTranslationsOnExecute(
  db.query.routes
    .findFirst(
      withTranslations({
        columns: {
          id: true,
          name: true,
          description: true,
          content: true,
          importance: true,
        },
        extras: {
          path: selectMultiLine('path', routes.path),
        },
        orderBy: [ascNullsEnd(routes.importance)],
        where: (route, { eq }) => eq(route.id, sql.placeholder('id')),
        with: {
          mainImage: true,
          categories: {
            columns: {},
            with: {
              category: withTranslations({
                columns: {
                  id: true,
                  icon: true,
                  name: true,
                },
              }),
            },
          },
          mainCategory: withTranslations({
            columns: {
              id: true,
              icon: true,
              color: true,
              name: true,
            },
          }),
          features: withTranslations({}),
        },
      })
    )
    .prepare()
)

export const routesRouter = router({
  listForMap: publicProcedure.query(async () => {
    return (await getAllRoutesForMap.execute()).map(calculatePath)
  }),
  get: publicProcedure.input(getRoutesSchema).query(async ({ input, ctx }) => {
    const result = await getRoute.execute({
      locale: input.locale,
      id: input.id,
      userId: ctx.session?.user.id,
    })
    return result
      ? calculatePath({
          ...result,
          images: [],
        })
      : undefined
  }),
})
