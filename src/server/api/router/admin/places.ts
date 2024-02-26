import 'server-only'

import { eq, sql } from 'drizzle-orm'
import { calculateLocation, pointToString } from '~/helpers/spatial-data/point'
import {
  createPlaceSchema,
  editPlaceSchema,
  getPlacesSchema,
  listCategoriesSchema,
  listPlacesSchema,
} from '~/schemas/places'
import { db } from '~/server/db/db'
import {
  features,
  placeCategories,
  places,
  placesToPlaceCategories,
} from '~/server/db/schema'
import { ascNullsEnd } from '~/server/helpers/order-by'
import { selectPoint } from '~/server/helpers/spatial-data/point'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { adminProcedure, router } from '~/server/trpc'

const getAllPlaces = flattenTranslationsOnExecute(
  db.query.places
    .findMany(
      withTranslations({
        columns: {
          id: true,
          name: true,
          description: true,
          importance: true,
        },
        extras: {
          location: selectPoint('location', places.location),
        },
        with: {
          categories: {
            columns: {},
            with: {
              category: {
                columns: {
                  id: true,
                  icon: true,
                  name: true,
                },
              },
            },
          },
          mainCategory: {
            columns: {
              id: true,
              icon: true,
              color: true,
              name: true,
            },
          },
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
          order: true,
        },
        orderBy: [ascNullsEnd(placeCategories.order)],
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
          name: true,
          description: true,
          content: true,
          importance: true,
        },
        extras: {
          location: selectPoint('location', places.location),
        },
        where: (place, { eq }) => eq(place.id, sql.placeholder('id')),
        with: {
          mainImage: true,
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
          features: true,
        },
      })
    )
    .prepare()
)

export const placesAdminRouter = router({
  list: adminProcedure.input(listPlacesSchema).query(async ({ input }) => {
    return (await getAllPlaces.execute({ locale: input.locale })).map(
      calculateLocation
    )
  }),
  get: adminProcedure.input(getPlacesSchema).query(async ({ input }) => {
    const result = await getPlace.execute({
      locale: input.locale,
      id: input.id,
    })
    return result ? calculateLocation(result) : undefined
  }),
  listCategories: adminProcedure
    .input(listCategoriesSchema)
    .query(async ({ input }) => {
      return await listCategories.execute({ locale: input.locale })
    }),
  createPlace: adminProcedure
    .input(createPlaceSchema)
    .mutation(async ({ input }) => {
      await db.transaction(async (tx) => {
        const insertFeaturesResult = await tx
          .insert(features)
          .values({ ...input.features })

        const featuresId = Number(insertFeaturesResult.insertId)

        const insertPlaceResult = await tx.insert(places).values({
          name: input.name,
          description: input.description,
          mainCategoryId: input.mainCategory,
          mainImageId: input.mainImageId,
          location: pointToString(input.location),
          importance: input.importance,
          content: input.content,
          verificationRequirementsId: 1,
          featuresId,
        })
        const newPlaceId = Number(insertPlaceResult.insertId)

        if (input.categories.length > 0) {
          await tx.insert(placesToPlaceCategories).values(
            input.categories.map((categoryId) => ({
              placeId: newPlaceId,
              categoryId: categoryId,
            }))
          )
        }

        return newPlaceId
      })
    }),
  editPlace: adminProcedure
    .input(editPlaceSchema)
    .mutation(async ({ input }) => {
      await db.transaction(async (tx) => {
        const placeId = Number(input.id)

        const featuresId = (
          await tx
            .selectDistinct({ featuresId: places.featuresId })
            .from(places)
            .where(eq(places.id, placeId))
        )[0].featuresId

        await tx
          .update(features)
          .set({
            id: featuresId,
            ...input.features,
          })
          .where(eq(features.id, featuresId))

        await tx
          .update(places)
          .set({
            name: input.name,
            description: input.description,
            mainCategoryId: input.mainCategory,
            mainImageId: input.mainImageId,
            location: pointToString(input.location),
            importance: input.importance,
            content: input.content,
            featuresId: featuresId,
          })
          .where(eq(places.id, placeId))

        await tx
          .delete(placesToPlaceCategories)
          .where(eq(placesToPlaceCategories.placeId, placeId))

        if (input.categories.length > 0) {
          await tx.insert(placesToPlaceCategories).values(
            input.categories.map((categoryId) => ({
              placeId: placeId,
              categoryId: categoryId,
            }))
          )
        }

        return placeId
      })
    }),
})
