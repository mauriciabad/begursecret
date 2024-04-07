import 'server-only'

import { sql } from 'drizzle-orm'
import { getPlacesSchema } from '~/schemas/places'
import { getRoutesSchema } from '~/schemas/routes'
import { db } from '~/server/db/db'
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
        },
        where: (place, { eq }) =>
          eq(place.id, sql`${sql.placeholder('id')}::integer`),
        with: {
          mainImage: {
            columns: {
              key: true,
              height: true,
              width: true,
              alt: true,
            },
          },
          categories: {
            columns: {},
            with: {
              category: withTranslations({
                columns: {
                  namePlural: true,
                },
              }),
            },
          },
          mainCategory: withTranslations({
            columns: {
              namePlural: true,
            },
          }),
        },
      })
    )
    .prepare('metadata/getPlace')
)

const getRoute = flattenTranslationsOnExecute(
  db.query.routes
    .findFirst(
      withTranslations({
        columns: {
          id: true,
          name: true,
          description: true,
        },
        where: (route, { eq }) =>
          eq(route.id, sql`${sql.placeholder('id')}::integer`),
        with: {
          mainImage: {
            columns: {
              key: true,
              height: true,
              width: true,
              alt: true,
            },
          },
          categories: {
            columns: {},
            with: {
              category: withTranslations({
                columns: {
                  namePlural: true,
                },
              }),
            },
          },
          mainCategory: withTranslations({
            columns: {
              namePlural: true,
            },
          }),
        },
      })
    )
    .prepare('metadata/getRoute')
)

export const metadataRouter = router({
  place: publicProcedure.input(getPlacesSchema).query(async ({ input }) => {
    return await getPlace.execute({
      locale: input.locale,
      id: input.id,
    })
  }),
  route: publicProcedure.input(getRoutesSchema).query(async ({ input }) => {
    return await getRoute.execute({
      locale: input.locale,
      id: input.id,
    })
  }),
})
