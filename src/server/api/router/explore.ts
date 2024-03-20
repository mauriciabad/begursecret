import { z } from 'zod'
import { defaultLocale, translatableLocales } from '~/i18n'
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
        },
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
        placeCategories: group.placeCategories.sort((a, b) =>
          a.category.namePlural.localeCompare(
            b.category.namePlural,
            input.locale ?? defaultLocale
          )
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
