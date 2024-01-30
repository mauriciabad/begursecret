import 'server-only'

import { calculateLocation, pointToString } from '~/helpers/spatial-data'
import {
  createPlaceSchema,
  listCategoriesSchema,
  listPlacesSchema,
} from '~/schemas/places'
import { db } from '~/server/db/db'
import { places, placesToPlaceCategories } from '~/server/db/schema'
import { selectPoint } from '~/server/helpers/spatial-data'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { adminProcedure, router } from '~/server/trpc'

const getAllPlaces = flattenTranslationsOnExecute(
  db.query.places
    .findMany(
      withTranslations({
        columns: {
          id: true,
          mainImage: true,
          name: true,
          description: true,
        },
        extras: {
          location: selectPoint('location', places.location),
        },
        with: {
          categories: {
            columns: {},
            with: {
              category: {
                columns: {
                  id: true,
                  icon: true,
                  name: true,
                },
              },
            },
          },
          mainCategory: {
            columns: {
              id: true,
              icon: true,
              color: true,
              name: true,
            },
          },
        },
      })
    )
    .prepare()
)

const listCategories = flattenTranslationsOnExecute(
  db.query.placeCategories
    .findMany(
      withTranslations({
        columns: {
          id: true,
          icon: true,
          name: true,
          namePlural: true,
          nameGender: true,
          color: true,
        },
      })
    )
    .prepare()
)

export const placesAdminRouter = router({
  list: adminProcedure.input(listPlacesSchema).query(async ({ input }) => {
    return (await getAllPlaces.execute({ locale: input.locale })).map(
      calculateLocation
    )
  }),
  listCategories: adminProcedure
    .input(listCategoriesSchema)
    .query(async ({ input }) => {
      return await listCategories.execute({ locale: input.locale })
    }),
  createPlace: adminProcedure
    .input(createPlaceSchema)
    .mutation(async ({ input }) => {
      await db.transaction(async (tx) => {
        const insertPlaceResult = await tx.insert(places).values({
          name: input.name,
          description: input.description,
          mainCategoryId: input.mainCategory,
          mainImage: input.mainImage,
          location: pointToString(input.location),
          content: input.content,
        })
        const newPlaceId = Number(insertPlaceResult.insertId)

        if (input.categories.length > 0) {
          await tx.insert(placesToPlaceCategories).values(
            input.categories.map((categoryId) => ({
              placeId: newPlaceId,
              categoryId: categoryId,
            }))
          )
        }

        return newPlaceId
      })
    }),
})
