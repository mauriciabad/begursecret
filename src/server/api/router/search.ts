import 'server-only'

import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { sortByImportance } from '~/helpers/sortBy'
import { translatableLocales } from '~/i18n'
import { numericIdSchema } from '~/schemas/shared'
import { db } from '~/server/db/db'
import { routes } from '~/server/db/schema'
import { ascNullsEnd } from '~/server/helpers/order-by'
import { doSomethingAfterExecute } from '~/server/helpers/translations/on-execute'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { publicProcedure, router } from '~/server/trpc'

const searchPlacesByMainCategory = flattenTranslationsOnExecute(
  db.query.places
    .findMany(
      withTranslations({
        columns: {
          id: true,
          name: true,
          description: true,
          importance: true,
        },
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

const searchPlacesBySecondaryCategory = doSomethingAfterExecute(
  flattenTranslationsOnExecute(
    db.query.placesToPlaceCategories
      .findMany({
        where: (placeToCategory, { eq, and, isNotNull }) =>
          and(
            isNotNull(placeToCategory.categoryId),
            eq(placeToCategory.categoryId, sql.placeholder('category'))
          ),
        with: {
          place: withTranslations({
            columns: {
              id: true,
              name: true,
              description: true,
              importance: true,
            },
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
          }),
        },
      })
      .prepare()
  ),
  (results) => {
    return results.map((r) => r.place)
  }
)

const searchRoutesByMainCategory = flattenTranslationsOnExecute(
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
const searchRoutesBySecondaryCategory = doSomethingAfterExecute(
  flattenTranslationsOnExecute(
    db.query.routesToRouteCategories
      .findMany({
        where: (routeToCategory, { eq, and, isNotNull }) =>
          and(
            isNotNull(routeToCategory.categoryId),
            eq(routeToCategory.categoryId, sql.placeholder('category'))
          ),
        with: {
          route: withTranslations({
            columns: {
              id: true,
              name: true,
              description: true,
              importance: true,
            },
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
          }),
        },
      })
      .prepare()
  ),
  (results) => {
    return results.map((r) => r.route)
  }
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
      return (
        await Promise.all([
          searchPlacesByMainCategory.execute({
            locale: input.locale,
            category: input.placeCategory,
          }),
          searchPlacesBySecondaryCategory.execute({
            locale: input.locale,
            category: input.placeCategory,
          }),
        ])
      )
        .flat()
        .sort(sortByImportance)
    }),
  routes: publicProcedure
    .input(
      z.object({
        locale: z.enum(translatableLocales).nullable(),
        routeCategory: numericIdSchema.nullable(),
      })
    )
    .query(async ({ input }) => {
      return (
        await Promise.all([
          searchRoutesByMainCategory.execute({
            locale: input.locale,
            category: input.routeCategory,
          }),
          searchRoutesBySecondaryCategory.execute({
            locale: input.locale,
            category: input.routeCategory,
          }),
        ])
      )
        .flat()
        .sort(sortByImportance)
    }),
})
