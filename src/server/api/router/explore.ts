import { z } from 'zod'
import { defaultLocale, translatableLocales } from '~/i18n'
import { db } from '~/server/db/db'
import { ascNullsEnd } from '~/server/helpers/order-by'
import { doSomethingAfterExecute } from '~/server/helpers/translations/on-execute'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { publicProcedure, router } from '~/server/trpc'

const getCategoryGroups = flattenTranslationsOnExecute(
  db.query.placeCategoryGroups
    .findMany(
      withTranslations({
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

const getCategoriesWithRoutes = doSomethingAfterExecute(
  flattenTranslationsOnExecute(
    db.query.routeCategories
      .findMany(
        withTranslations({
          with: {
            mainRoutes: withTranslations({
              columns: {
                id: true,
                name: true,
                importance: true,
              },
              with: {
                mainImage: true,
              },
            }),
            secondaryRoutes: {
              with: {
                route: withTranslations({
                  columns: {
                    id: true,
                    name: true,
                    importance: true,
                  },
                  with: {
                    mainImage: true,
                  },
                }),
              },
            },
          },
          orderBy: (category) => [ascNullsEnd(category.order)],
        })
      )
      .prepare()
  ),
  (categories) =>
    categories.map(({ mainRoutes, secondaryRoutes, ...category }) => ({
      ...category,
      routes: [...mainRoutes, ...secondaryRoutes.map(({ route }) => route)]
        .filter(isFirstOccurence)
        .sort(sortByImportance),
    }))
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
  listRoutes: publicProcedure
    .input(z.object({ locale: z.enum(translatableLocales).nullable() }))
    .query(async ({ input }) => {
      return await getCategoriesWithRoutes.execute({
        locale: input.locale,
      })
    }),
})

const sortByImportance = <T extends { importance: number | null }>(
  a: T,
  b: T
) => {
  if (a.importance === b.importance) return 0
  if (a.importance === null) return 1
  if (b.importance === null) return -1
  return a.importance > b.importance ? -1 : 1
}

const isFirstOccurence = <T extends { id: number }>(
  place: T,
  index: number,
  self: T[]
) => {
  return self.findIndex((p) => p.id === place.id) === index
}
