import 'server-only'
import { calculateLocation } from '~/helpers/spatial-data'

import { getVisitMissionsSchema } from '~/schemas/missions'
import { db } from '~/server/db/db'
import { places } from '~/server/db/schema'
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
        where: (placeCategories, { eq }) =>
          eq(placeCategories.hasVisitMission, true),
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
      const result = await getVisitMissions.execute({ locale: input.locale })
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
  const rnd = Math.random()
  const { categories, ...placeWithLocation } = calculateLocation(place)
  return {
    missionStatus: { visited: rnd <= 0.45, verified: rnd <= 0.2 },
    categories: categories.map(({ category }) => category),
    images: [],

    ...placeWithLocation,
  }
}
