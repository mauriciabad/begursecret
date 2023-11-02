import 'server-only'

import { sql } from 'drizzle-orm'
import { calculateLocation } from '~/helpers/spatial-data'
import { getPlacesSchema, listPlacesSchema } from '~/schemas/places'
import { db } from '~/server/db/db'
import { places } from '~/server/db/schema'
import { selectPoint } from '~/server/helpers/spatial-data'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { procedure, router } from '~/server/trpc'

const getAllPlaces = flattenTranslationsOnExecute(
  db.query.places
    .findMany(
      withTranslations({
        columns: {
          id: true,
          mainImage: true,
          name: true,
        },
        extras: {
          location: selectPoint('location', places.location),
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
          name: true,
        },
        extras: {
          location: selectPoint('location', places.location),
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
    return (await getAllPlaces.execute({ locale: input.locale })).map(
      calculateLocation
    )
  }),
  get: procedure.input(getPlacesSchema).query(async ({ input }) => {
    const result = await getPlace.execute({
      locale: input.locale,
      id: input.id,
    })
    return result ? calculateLocation(result) : undefined
  }),
})
