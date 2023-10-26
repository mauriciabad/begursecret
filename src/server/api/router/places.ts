import 'server-only'

import { asc, eq, isNull, or, sql } from 'drizzle-orm'
import { listPlacesSchema } from '~/schemas/places'
import { db } from '~/server/db/db'
import { places, placesTranslations } from '~/server/db/schema/places'
import { procedure, router } from '~/server/trpc'
import {
  flattenTranslations,
  selectTranslations,
} from '../../helpers/translations'

const getAllPlaces = db
  .select({
    id: places.id,
    mainImage: places.mainImage,

    ...selectTranslations({
      fields: ['name'],
      normalTable: places,
      translationsTable: placesTranslations,
    }),
  })
  .from(places)
  .leftJoin(placesTranslations, eq(places.id, placesTranslations.placeId))
  .where(
    or(
      eq(placesTranslations.locale, sql.placeholder('locale')),
      isNull(placesTranslations.locale)
    )
  )
  .orderBy(asc(placesTranslations.name))
  .prepare()

export const placesRouter = router({
  list: procedure.input(listPlacesSchema).query(async ({ input }) => {
    const result = await getAllPlaces.execute({ locale: input.locale })
    return result.map(flattenTranslations)
  }),
})
