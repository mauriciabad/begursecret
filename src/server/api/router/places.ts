import 'server-only'

import { sql } from 'drizzle-orm'
import { calculateLocation } from '~/helpers/spatial-data'
import {
  getPlacesSchema,
  listCategoriesSchema,
  listPlacesSchema,
  searchPlacesSchema,
} from '~/schemas/places'
import { db } from '~/server/db/db'
import { places } from '~/server/db/schema'
import { getVisitedPlacesIdsByUserId } from '~/server/helpers/db-queries/placeLists'
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

const searchPlaces = flattenTranslationsOnExecute(
  db.query.places
    .findMany(
      withTranslations({
        columns: {
          id: true,
          mainImage: true,
          name: true,
          description: true,
        },
        extras: {
          location: selectPoint('location', places.location),
        },
        where: (place, { eq, and, isNotNull }) =>
          and(
            isNotNull(place.mainCategoryId),
            eq(place.mainCategoryId, sql.placeholder('category'))
          ),
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
          description: true,
          content: true,
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

const listCategories = flattenTranslationsOnExecute(
  db.query.placeCategories
    .findMany(
      withTranslations({
        columns: {
          id: true,
          icon: true,
          name: true,
          namePlural: true,
          nameGender: true,
          color: true,
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
  search: procedure.input(searchPlacesSchema).query(async ({ input }) => {
    return (
      await searchPlaces.execute({
        locale: input.locale,
        category: input.category,
      })
    ).map(calculateLocation)
  }),
  get: procedure.input(getPlacesSchema).query(async ({ input, ctx }) => {
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
  listCategories: procedure
    .input(listCategoriesSchema)
    .query(async ({ input }) => {
      return await listCategories.execute({ locale: input.locale })
    }),
})
