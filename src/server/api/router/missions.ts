import { sql } from 'drizzle-orm'
import 'server-only'
import { calculateLocation } from '~/helpers/spatial-data'

import { getVisitMissionsSchema } from '~/schemas/missions'
import { db } from '~/server/db/db'
import { places, placesToPlaceCategories } from '~/server/db/schema'
import { selectPoint } from '~/server/helpers/spatial-data'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { procedure, router } from '~/server/trpc'

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
                  mainImage: true,
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
                      name: true,
                      color: true,
                    },
                  }),
                },
              }),
            },
          },
          mainPlaces: withTranslations({
            columns: {
              id: true,
              name: true,
              description: true,
              mainImage: true,
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
                  name: true,
                  color: true,
                },
              }),
            },
          }),
        },
      })
    )
    .prepare()
)

export const missionsRouter = router({
  getVisitMissions: procedure
    .input(getVisitMissionsSchema)
    .query(async ({ input }) => {
      const result = await getVisitMissions.execute({
        locale: input.locale,
        placeId: input.placeId,
      })
      return result
        .map(({ places, mainPlaces, ...category }) => ({
          category,
          places: [
            ...mainPlaces.map((place) => mapPlace(place)),
            ...places.map(({ place }) => mapPlace(place)),
          ],
        }))
        .filter(({ places }) => places.length > 0)
    }),
})

const mapPlace = <
  T extends {
    location: any // eslint-disable-line @typescript-eslint/no-explicit-any
    categories: {
      category: any // eslint-disable-line @typescript-eslint/no-explicit-any
    }[]
  },
>(
  place: T
) => {
  const { categories, ...placeWithLocation } = calculateLocation(place)
  return {
    missionStatus: {
      visited: false,
      verified: false,
    },
    categories: categories.map(({ category }) => category),
    images: [],

    ...placeWithLocation,
  }
}
