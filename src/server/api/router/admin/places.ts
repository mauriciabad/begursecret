import 'server-only'

import { calculateLocation } from '~/helpers/spatial-data'
import { listCategoriesSchema, listPlacesSchema } from '~/schemas/places'
import { db } from '~/server/db/db'
import { places } from '~/server/db/schema'
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
})
