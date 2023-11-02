import 'server-only'

import { sql } from 'drizzle-orm'
import { getPlacesSchema, listPlacesSchema } from '~/schemas/places'
import { db } from '~/server/db/db'
import { flattenTranslations } from '~/server/helpers/translations/flatten'
import { procedure, router } from '~/server/trpc'

const getAllPlaces = db.query.places
  .findMany({
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
        with: {
          translations: {
            columns: {
              id: false,
              locale: false,
              placeCategoryId: false,
            },
            where: (translations, { eq, and, isNotNull }) =>
              and(
                isNotNull(sql.placeholder('locale')),
                eq(translations.locale, sql.placeholder('locale'))
              ),
          },
        },
      },
      translations: {
        columns: {
          id: false,
          locale: false,
          placeId: false,
        },
        where: (translations, { eq, and, isNotNull }) =>
          and(
            isNotNull(sql.placeholder('locale')),
            eq(translations.locale, sql.placeholder('locale'))
          ),
      },
    },
  })
  .prepare()

const getPlace = db.query.places
  .findFirst({
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
        with: {
          translations: {
            columns: {
              id: false,
              locale: false,
              placeCategoryId: false,
            },
            where: (translations, { eq, and, isNotNull }) =>
              and(
                isNotNull(sql.placeholder('locale')),
                eq(translations.locale, sql.placeholder('locale'))
              ),
          },
        },
      },
      translations: {
        columns: {
          id: false,
          locale: false,
          placeId: false,
        },
        where: (translations, { eq, and, isNotNull }) =>
          and(
            isNotNull(sql.placeholder('locale')),
            eq(translations.locale, sql.placeholder('locale'))
          ),
      },
    },
  })
  .prepare()

export const placesRouter = router({
  list: procedure.input(listPlacesSchema).query(async ({ input }) => {
    return flattenTranslations(
      await getAllPlaces.execute({ locale: input.locale })
    )
  }),
  get: procedure.input(getPlacesSchema).query(async ({ input }) => {
    return flattenTranslations(
      await getPlace.execute({
        locale: input.locale,
        id: input.id,
      })
    )
  }),
})
