import { z } from 'zod'
import { sortByOrder } from '~/helpers/sortBy'
import { translatableLocales } from '~/i18n'
import { db } from '~/server/db/db'
import { ascNullsEnd } from '~/server/helpers/order-by'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { publicProcedure, router } from '~/server/trpc'

const getCategoryGroups = flattenTranslationsOnExecute(
  db.query.placeCategoryGroups
    .findMany(
      withTranslations({
        columns: {
          id: true,
          name: true,
          order: true,
        },
        with: {
          placeCategories: {
            columns: {
              highlight: true,
            },
            with: {
              category: withTranslations({
                columns: {
                  id: true,
                  namePlural: true,
                  icon: true,
                  color: true,
                  order: true,
                },
              }),
            },
          },
        },
        orderBy: (group) => [ascNullsEnd(group.order)],
      })
    )
    .prepare()
)

const getRouteCategories = flattenTranslationsOnExecute(
  db.query.routeCategories
    .findMany(
      withTranslations({
        columns: {
          id: true,
          namePlural: true,
          icon: true,
          color: true,
          order: true,
        },
        orderBy: (group) => [ascNullsEnd(group.order)],
      })
    )
    .prepare()
)

export const exploreRouter = router({
  listCategoryGroups: publicProcedure
    .input(z.object({ locale: z.enum(translatableLocales).nullable() }))
    .query(async ({ input }) => {
      const groups = await getCategoryGroups.execute({
        locale: input.locale,
      })

      return groups.map((group) => ({
        ...group,
        placeCategories: group.placeCategories.sort(
          ({ category: a }, { category: b }) => sortByOrder(a, b)
        ),
      }))
    }),
  listRouteCategories: publicProcedure
    .input(z.object({ locale: z.enum(translatableLocales).nullable() }))
    .query(async ({ input }) => {
      return await getRouteCategories.execute({
        locale: input.locale,
      })
    }),
})
