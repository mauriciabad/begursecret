import 'server-only'

import { sql } from 'drizzle-orm'
import { getPoint } from '~/helpers/spatial-data'

import { getVisitMissionsSchema } from '~/schemas/missions'
import { db } from '~/server/db/db'
import { places, placesToPlaceCategories } from '~/server/db/schema'
import { getVisitedPlacesIdsByUserId } from '~/server/helpers/db-queries/placeLists'
import { selectPoint } from '~/server/helpers/spatial-data'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { publicProcedure, router } from '~/server/trpc'

const getVisitMissions = flattenTranslationsOnExecute(
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
        where: (placeCategories, { eq, and, or, inArray, isNull }) =>
          and(
            eq(placeCategories.hasVisitMission, true),
            or(
              isNull(sql.placeholder('placeId')),
              eq(
                placeCategories.id,
                db
                  .selectDistinct({ data: places.mainCategoryId })
                  .from(places)
                  .where(eq(places.id, sql.placeholder('placeId')))
              ),
              inArray(
                placeCategories.id,
                db
                  .select({ data: placesToPlaceCategories.categoryId })
                  .from(placesToPlaceCategories)
                  .where(
                    eq(
                      placesToPlaceCategories.placeId,
                      sql.placeholder('placeId')
                    )
                  )
              )
            )
          ),
        with: {
          places: {
            with: {
              place: withTranslations({
                columns: {
                  id: true,
                  name: true,
                  description: true,
                },
                extras: {
                  location: selectPoint('location', places.location),
                },
                with: {
                  // mainImage: true,
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
                      name: true,
                      color: true,
                    },
                  }),
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
              }),
            },
          },
          mainPlaces: withTranslations({
            columns: {
              id: true,
              name: true,
              description: true,
            },
            extras: {
              location: selectPoint('location', places.location),
            },
            with: {
              // mainImage: true,
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
                  name: true,
                  color: true,
                },
              }),
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
          }),
        },
      })
    )
    .prepare()
)

export const missionsRouter = router({
  getVisitMissions: publicProcedure
    .input(getVisitMissionsSchema)
    .query(async ({ input, ctx }) => {
      const result = await getVisitMissions.execute({
        locale: input.locale,
        placeId: input.placeId,
        userId: ctx.session?.user.id,
      })

      const visitedPlacesIds = await getVisitedPlacesIdsByUserId(
        ctx.session?.user.id
      )

      return result
        .map(({ places, mainPlaces, ...category }) => {
          const mainPlacesIds = mainPlaces.map((place) => place.id)
          return {
            category,
            places: [
              ...mainPlaces,
              ...places
                .map(({ place }) => place)
                .filter((place) => !mainPlacesIds.includes(place.id)),
            ].map(({ location, categories, ...place }) => ({
              ...place,
              location: getPoint(location),
              categories: categories.map(({ category }) => category),
              images: [],
              visited: visitedPlacesIds.has(place.id),
            })),
          }
        })
        .filter(({ places }) => places.length > 0)
    }),
})
