import 'server-only'

import { eq, sql } from 'drizzle-orm'
import {
  calculatePath,
  multiLineToString,
} from '~/helpers/spatial-data/multi-line'
import {
  createRouteSchema,
  editRouteSchema,
  getRoutesSchema,
  listCategoriesSchema,
  listRoutesSchema,
} from '~/schemas/routes'
import { db } from '~/server/db/db'
import { features, routes, routesToRouteCategories } from '~/server/db/schema'
import { selectMultiLine } from '~/server/helpers/spatial-data/multi-line'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { adminProcedure, router } from '~/server/trpc'

const getAllRoutes = flattenTranslationsOnExecute(
  db.query.routes
    .findMany(
      withTranslations({
        columns: {
          id: true,
          name: true,
          description: true,
        },
        extras: {
          path: selectMultiLine('path', routes.path),
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
  db.query.routeCategories
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

const getRoute = flattenTranslationsOnExecute(
  db.query.routes
    .findFirst(
      withTranslations({
        columns: {
          id: true,
          name: true,
          description: true,
          content: true,
        },
        extras: {
          path: selectMultiLine('path', routes.path),
        },
        where: (route, { eq }) => eq(route.id, sql.placeholder('id')),
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

export const routesAdminRouter = router({
  list: adminProcedure.input(listRoutesSchema).query(async ({ input }) => {
    return (await getAllRoutes.execute({ locale: input.locale })).map(
      calculatePath
    )
  }),
  get: adminProcedure.input(getRoutesSchema).query(async ({ input }) => {
    const result = await getRoute.execute({
      locale: input.locale,
      id: input.id,
    })
    return result ? calculatePath(result) : undefined
  }),
  listCategories: adminProcedure
    .input(listCategoriesSchema)
    .query(async ({ input }) => {
      return await listCategories.execute({ locale: input.locale })
    }),
  createRoute: adminProcedure
    .input(createRouteSchema)
    .mutation(async ({ input }) => {
      await db.transaction(async (tx) => {
        const insertFeaturesResult = await tx
          .insert(features)
          .values({ ...input.features })

        const featuresId = Number(insertFeaturesResult.insertId)

        const insertRouteResult = await tx.insert(routes).values({
          name: input.name,
          description: input.description,
          mainCategoryId: input.mainCategory,
          path: multiLineToString(input.path),
          content: input.content,
          verificationRequirementsId: 1,
          featuresId,
        })
        const newRouteId = Number(insertRouteResult.insertId)

        if (input.categories.length > 0) {
          await tx.insert(routesToRouteCategories).values(
            input.categories.map((categoryId) => ({
              routeId: newRouteId,
              categoryId: categoryId,
            }))
          )
        }

        return newRouteId
      })
    }),
  editRoute: adminProcedure
    .input(editRouteSchema)
    .mutation(async ({ input }) => {
      await db.transaction(async (tx) => {
        const routeId = Number(input.id)

        const featuresId = (
          await tx
            .selectDistinct({ featuresId: routes.featuresId })
            .from(routes)
            .where(eq(routes.id, routeId))
        )[0].featuresId

        await tx
          .update(features)
          .set({
            id: featuresId,
            ...input.features,
          })
          .where(eq(features.id, featuresId))

        await tx
          .update(routes)
          .set({
            name: input.name,
            description: input.description,
            mainCategoryId: input.mainCategory,
            path: multiLineToString(input.path),
            content: input.content,
            featuresId: featuresId,
          })
          .where(eq(routes.id, routeId))
        await tx
          .delete(routesToRouteCategories)
          .where(eq(routesToRouteCategories.routeId, routeId))

        if (input.categories.length > 0) {
          await tx.insert(routesToRouteCategories).values(
            input.categories.map((categoryId) => ({
              routeId: routeId,
              categoryId: categoryId,
            }))
          )
        }

        return routeId
      })
    }),
})
