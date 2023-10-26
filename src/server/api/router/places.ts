import 'server-only'

import { asc, eq, sql } from 'drizzle-orm'
import { listPlacesSchema } from '~/schemas/places'
import { db } from '~/server/db/db'
import { places, placesTranslations } from '~/server/db/schema/places'
import { procedure, router } from '~/server/trpc'
import {
  flattenTranslations,
  selectTranslations,
} from '../../helpers/translations'

const placeTranslationsInLocale = db
  .select()
  .from(placesTranslations)
  .where(eq(placesTranslations.locale, sql.placeholder('locale')))
  .as('placeTranslationsInLocale')

const getAllPlaces = db
  .select({
    id: places.id,
    mainImage: places.mainImage,

    ...selectTranslations({
      fields: ['name'],
      normalTable: places,
      translationsTable: placeTranslationsInLocale,
    }),
  })
  .from(places)
  .leftJoin(
    placeTranslationsInLocale,
    eq(places.id, placeTranslationsInLocale.placeId)
  )
  .orderBy(asc(placeTranslationsInLocale.name))
  .prepare()

export const placesRouter = router({
  list: procedure.input(listPlacesSchema).query(async ({ input }) => {
    const result = await getAllPlaces.execute({ locale: input.locale })
    return result.map(flattenTranslations)
  }),
})
