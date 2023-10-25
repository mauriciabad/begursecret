import 'server-only'

import { and, asc, eq, notExists, or, sql } from 'drizzle-orm'
import { db } from '~/server/db/db'
import { placesData, placesTranslations } from '~/server/db/schema/places'
import { procedure, router } from '~/server/trpc'
import { listPlacesSchema } from '~/schemas/places'
import { defaultLocale } from '~/i18n'

const getAllPlaces = db
  .select({
    id: placesData.id,
    mainImage: placesData.mainImage,
    name: placesTranslations.name,
  })
  .from(placesData)
  .innerJoin(placesTranslations, eq(placesData.id, placesTranslations.placeId))
  .where(
    or(
      eq(placesTranslations.locale, sql.placeholder('locale')),
      and(
        eq(placesTranslations.locale, defaultLocale),
        notExists(
          db
            .select()
            .from(placesTranslations)
            .where(
              and(
                eq(placesTranslations.placeId, placesData.id),
                eq(placesTranslations.locale, sql.placeholder('locale'))
              )
            )
        )
      )
    )
  )
  .orderBy(asc(placesTranslations.name))
  .prepare()

export const placesRouter = router({
  list: procedure.input(listPlacesSchema).query(async ({ input }) => {
    return await getAllPlaces.execute({ locale: input.locale })
  }),
})
