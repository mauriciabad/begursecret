import { z } from 'zod'
import { translatableLocales } from '~/i18n'
import { db } from '~/server/db/db'
import { placeCategoriesToPlaceCategoryGroups } from '~/server/db/schema'
import { ascNullsEnd } from '~/server/helpers/order-by'
import { doSomethingAfterExecute } from '~/server/helpers/translations/on-execute'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { publicProcedure, router } from '~/server/trpc'

const placeCategoryGroupIdByName = {
  nature: 1,
  activities: 2,
  historyAndCulture: 3,
  infrastructure: 4,
  shops: 5,
  restaurants: 6,
  leisureAndSports: 7,
  services: 8,
  foodAndSupermarkets: 9,
  accommodation: 10,
} as const satisfies Record<string, number>

const makeGetCategoriesWithPlaces = (categoryGroupIds: number[]) =>
  doSomethingAfterExecute(
    flattenTranslationsOnExecute(
      db.query.placeCategories
        .findMany(
          withTranslations({
            where: (category, { inArray }) =>
              inArray(
                category.id,
                db
                  .select({
                    data: placeCategoriesToPlaceCategoryGroups.categoryId,
                  })
                  .from(placeCategoriesToPlaceCategoryGroups)
                  .where(
                    inArray(
                      placeCategoriesToPlaceCategoryGroups.categoryGroupId,
                      categoryGroupIds
                    )
                  )
              ),
            with: {
              mainPlaces: withTranslations({
                columns: {
                  id: true,
                  name: true,
                  importance: true,
                },
                with: {
                  mainImage: true,
                },
              }),
              secondaryPlaces: {
                with: {
                  place: withTranslations({
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
      categories.map(({ mainPlaces, secondaryPlaces, ...category }) => ({
        ...category,
        places: [...mainPlaces, ...secondaryPlaces.map(({ place }) => place)]
          .filter(isFirstOccurence)
          .sort(sortByImportance),
      }))
  )

const getCategoriesWithPlacesForBussinesses = makeGetCategoriesWithPlaces([
  placeCategoryGroupIdByName.shops,
  placeCategoryGroupIdByName.restaurants,
  placeCategoryGroupIdByName.leisureAndSports,
  placeCategoryGroupIdByName.services,
  placeCategoryGroupIdByName.foodAndSupermarkets,
  placeCategoryGroupIdByName.accommodation,
])
const getCategoriesWithPlacesForPlaces = makeGetCategoriesWithPlaces([
  placeCategoryGroupIdByName.nature,
  placeCategoryGroupIdByName.activities,
  placeCategoryGroupIdByName.historyAndCulture,
  placeCategoryGroupIdByName.infrastructure,
])

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
  listBussinesses: publicProcedure
    .input(z.object({ locale: z.enum(translatableLocales).nullable() }))
    .query(async ({ input }) => {
      return await getCategoriesWithPlacesForBussinesses.execute({
        locale: input.locale,
      })
    }),
  listPlaces: publicProcedure
    .input(z.object({ locale: z.enum(translatableLocales).nullable() }))
    .query(async ({ input }) => {
      return await getCategoriesWithPlacesForPlaces.execute({
        locale: input.locale,
      })
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
