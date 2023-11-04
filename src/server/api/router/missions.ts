import 'server-only'

import { getVisitMissionsSchema } from '~/schemas/missions'
import { db } from '~/server/db/db'
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
        with: {
          places: {
            with: {
              place: withTranslations({
                columns: {
                  id: true,
                  name: true,
                },
              }),
            },
          },
          mainPlaces: withTranslations({
            columns: {
              id: true,
              name: true,
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
            ...mainPlaces.map((place) => {
              const rnd = Math.random()
              return {
                visited: rnd <= 0.4,
                verified: rnd <= 0.2,
                ...place,
              }
            }),
            ...places.map(({ place }) => {
              const rnd = Math.random()
              return {
                visited: rnd <= 0.45,
                verified: rnd <= 0.2,
                ...place,
              }
            }),
          ],
        }))
        .filter(({ places }) => places.length > 0)
    }),
})
