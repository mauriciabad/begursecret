import 'server-only'

import { and, asc, eq, sql } from 'drizzle-orm'
import { getPlacesSchema, listPlacesSchema } from '~/schemas/places'
import { db } from '~/server/db/db'
import { places, placesTranslations } from '~/server/db/schema/places'
import { selectPoint } from '~/server/helpers/spatial-data'
import { procedure, router } from '~/server/trpc'
import {
  flattenTranslations,
  selectTranslations,
} from '../../helpers/translations'

const allPlacesTranslationsInLocale = db
  .select()
  .from(placesTranslations)
  .where(eq(placesTranslations.locale, sql.placeholder('locale')))
  .as('allPlacesTranslationsInLocale')

const getAllPlaces = db
  .select({
    id: places.id,
    mainImage: places.mainImage,
    location: selectPoint('location', places.location),

    ...selectTranslations({
      fields: ['name'],
      normalTable: places,
      translationsTable: allPlacesTranslationsInLocale,
    }),
  })
  .from(places)
  .leftJoin(
    allPlacesTranslationsInLocale,
    eq(places.id, allPlacesTranslationsInLocale.placeId)
  )
  .orderBy(asc(allPlacesTranslationsInLocale.name))
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
  .prepare()

export const placesRouter = router({
  list: procedure.input(listPlacesSchema).query(async ({ input }) => {
    const result = await getAllPlaces.execute({ locale: input.locale })
    return result.map(flattenTranslations)
  }),
  get: procedure.input(getPlacesSchema).query(async ({ input }) => {
    const result = await getPlace.execute({
      locale: input.locale,
      id: input.id,
    })
    return result.map(flattenTranslations)[0]
  }),
})
