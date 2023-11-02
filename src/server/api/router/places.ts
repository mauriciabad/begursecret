import 'server-only'

import { sql } from 'drizzle-orm'
import { getPlacesSchema,listPlacesSchema } from '~/schemas/places'
import { db } from '~/server/db/db'
import { flattenTranslationsOnExecute,withTranslations } from '~/server/helpers/translations/query/with-translations'
import { procedure,router } from '~/server/trpc'

const getAllPlaces = flattenTranslationsOnExecute(
  db.query.places
    .findMany(
      withTranslations({
        columns: {
          id: true,
          mainImage: true,
          location: true,
          name: true,
        },
        with: {
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

const getPlace = flattenTranslationsOnExecute(
  db.query.places
    .findFirst(
      withTranslations({
        columns: {
          id: true,
          mainImage: true,
          location: true,
          name: true,
        },
        where: (place, { eq }) => eq(place.id, sql.placeholder('id')),
        with: {
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

export const placesRouter = router({
  list: procedure.input(listPlacesSchema).query(async ({ input }) => {
    return await getAllPlaces.execute({ locale: input.locale })
  }),
  get: procedure.input(getPlacesSchema).query(async ({ input }) => {
    return await getPlace.execute({
      locale: input.locale,
      id: input.id,
    })
  }),
})
