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
  bussinesses: 4,
  infrastructure: 5,
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
              places: {
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
      categories.map(({ mainPlaces, places, ...category }) => ({
        ...category,
        places: [...mainPlaces, ...places.map(({ place }) => place)]
          .filter((place, index, self) => {
            return self.findIndex((p) => p.id === place.id) === index
          })
          .sort((a, b) => {
            if (a.importance === b.importance) return 0
            if (a.importance === null) return 1
            if (b.importance === null) return -1
            return a.importance > b.importance ? -1 : 1
          }),
      }))
  )

const getCategoriesWithPlacesForBussinesses = makeGetCategoriesWithPlaces([
  placeCategoryGroupIdByName.bussinesses,
])
const getCategoriesWithPlacesForPlaces = makeGetCategoriesWithPlaces([
  placeCategoryGroupIdByName.nature,
  placeCategoryGroupIdByName.activities,
  placeCategoryGroupIdByName.historyAndCulture,
  placeCategoryGroupIdByName.infrastructure,
])

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
})
