import 'server-only'

import { and, eq, sql } from 'drizzle-orm'
import { getPlacesSchema, listPlacesSchema } from '~/schemas/places'
import { db } from '~/server/db/db'
import {
  placeCategories,
  places,
  placesTranslations,
} from '~/server/db/schema/places'
import { selectPoint } from '~/server/helpers/spatial-data'
import { flattenTranslations } from '~/server/helpers/translations/flatten'
import { procedure, router } from '~/server/trpc'
import {
  flattenTranslationsFromSelect,
  selectTranslations,
} from '../../helpers/translations/select'

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

const placeTranslationsInLocale = db
  .select()
  .from(placesTranslations)
  .where(
    and(
      eq(placesTranslations.placeId, sql.placeholder('id')),
      eq(placesTranslations.locale, sql.placeholder('locale'))
    )
  )
  .as('placeTranslationsInLocale')

const getPlace = db
  .selectDistinct({
    id: places.id,
    mainImage: places.mainImage,
    location: selectPoint('location', places.location),
    mainCategory: {
      name: placeCategories.name, // TODO: Select translations
      icon: placeCategories.icon,
      color: placeCategories.color,
    },

    ...selectTranslations({
      fields: ['name'],
      normalTable: places,
      translationsTable: placeTranslationsInLocale,
    }),
  })
  .from(places)
  .where(eq(places.id, sql.placeholder('id')))
  .leftJoin(
    placeTranslationsInLocale,
    eq(places.id, placeTranslationsInLocale.placeId)
  )
  .leftJoin(placeCategories, eq(places.mainCategoryId, placeCategories.id))
  .prepare()

export const placesRouter = router({
  list: procedure.input(listPlacesSchema).query(async ({ input }) => {
    return flattenTranslations(
      await getAllPlaces.execute({ locale: input.locale })
    )
  }),
  get: procedure.input(getPlacesSchema).query(async ({ input }) => {
    const result = await getPlace.execute({
      locale: input.locale,
      id: input.id,
    })
    return result.map(flattenTranslationsFromSelect)[0]
  }),
})
