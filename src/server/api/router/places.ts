import 'server-only'

import { sql } from 'drizzle-orm'
import { calculateLocation } from '~/helpers/spatial-data/point'
import { getPlacesSchema } from '~/schemas/places'
import { db } from '~/server/db/db'
import { places } from '~/server/db/schema'
import { getVisitedPlacesIdsByUserId } from '~/server/helpers/db-queries/placeLists'
import { selectPoint } from '~/server/helpers/spatial-data/point'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { publicProcedure, router } from '~/server/trpc'

const getPlace = flattenTranslationsOnExecute(
  db.query.places
    .findFirst(
      withTranslations({
        columns: {
          id: true,
          name: true,
          description: true,
          content: true,
          importance: true,
          googleMapsId: true,
        },
        extras: {
          location: selectPoint('location', places.location),
        },
        where: (place, { eq }) => eq(place.id, sql.placeholder('id')),
        with: {
          mainImage: true,
          externalLinks: withTranslations({}),
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
          features: withTranslations({}),
          verifications: {
            columns: {
              id: true,
              validatedOn: true,
            },
            orderBy: (verifications, { desc }) => [
              desc(verifications.validatedOn),
            ],
            where: (verification, { or, isNull, eq }) =>
              or(
                isNull(sql.placeholder('userId')),
                eq(verification.userId, sql.placeholder('userId'))
              ),
            limit: 1,
          },
          verificationRequirements: true,
        },
      })
    )
    .prepare()
)

export const placesRouter = router({
  get: publicProcedure.input(getPlacesSchema).query(async ({ input, ctx }) => {
    const visitedPlacesIds = await getVisitedPlacesIdsByUserId(
      ctx.session?.user.id
    )

    const result = await getPlace.execute({
      locale: input.locale,
      id: input.id,
      userId: ctx.session?.user.id,
    })
    return result
      ? calculateLocation({
          ...result,
          images: [],
          visited: visitedPlacesIds.has(input.id),
        })
      : undefined
  }),
})
