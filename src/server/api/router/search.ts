import 'server-only'

import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { translatableLocales } from '~/i18n'
import { numericIdSchema } from '~/schemas/shared'
import { db } from '~/server/db/db'
import { places, routes } from '~/server/db/schema'
import { ascNullsEnd } from '~/server/helpers/order-by'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { publicProcedure, router } from '~/server/trpc'

const searchPlaces = flattenTranslationsOnExecute(
  db.query.places
    .findMany(
      withTranslations({
        columns: {
          id: true,
          name: true,
          description: true,
          importance: true,
        },
        orderBy: [ascNullsEnd(places.importance)],
        where: (place, { eq, and, isNotNull }) =>
          and(
            isNotNull(place.mainCategoryId),
            eq(place.mainCategoryId, sql.placeholder('category'))
          ),
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
        },
      })
    )
    .prepare()
)
const searchRoutes = flattenTranslationsOnExecute(
  db.query.routes
    .findMany(
      withTranslations({
        columns: {
          id: true,
          name: true,
          description: true,
          importance: true,
        },
        orderBy: [ascNullsEnd(routes.importance)],
        where: (route, { eq, and, isNotNull }) =>
          and(
            isNotNull(route.mainCategoryId),
            eq(route.mainCategoryId, sql.placeholder('category'))
          ),
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
        },
      })
    )
    .prepare()
)

export const searchRouter = router({
  places: publicProcedure
    .input(
      z.object({
        locale: z.enum(translatableLocales).nullable(),
        placeCategory: numericIdSchema.nullable(),
      })
    )
    .query(async ({ input }) => {
      return await searchPlaces.execute({
        locale: input.locale,
        category: input.placeCategory,
      })
    }),
  routes: publicProcedure
    .input(
      z.object({
        locale: z.enum(translatableLocales).nullable(),
        routeCategory: numericIdSchema.nullable(),
      })
    )
    .query(async ({ input }) => {
      return await searchRoutes.execute({
        locale: input.locale,
        category: input.routeCategory,
      })
    }),
})
