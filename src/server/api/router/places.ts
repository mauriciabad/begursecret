import 'server-only'

import { asc, eq, sql } from 'drizzle-orm'
import { db } from '~/server/db/db'
import { placesData, placesTranslations } from '~/server/db/schema/places'
import { procedure, router } from '~/server/trpc'
import { listPlacesSchema } from '~/schemas/places'

// TODO: Handle when a specific place doesn't have a translation for the given locale while others do.
// Right now what happens is that the place without the locale is not returned in the list
const getAllPlaces = db
  .select({
    id: placesData.id,
    mainImage: placesData.mainImage,
    name: placesTranslations.name,
  })
  .from(placesData)
  .innerJoin(placesTranslations, eq(placesData.id, placesTranslations.placeId))
  .where(eq(placesTranslations.locale, sql.placeholder('locale')))
  .orderBy(asc(placesTranslations.name))
  .prepare()

export const placesRouter = router({
  list: procedure.input(listPlacesSchema).query(async ({ input }) => {
    return await getAllPlaces.execute({ locale: input.locale })
  }),
})
