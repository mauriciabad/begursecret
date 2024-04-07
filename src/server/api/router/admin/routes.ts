import 'server-only'

import { and, asc, eq, isNull, like, or, sql } from 'drizzle-orm'
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
import {
  externalLinks,
  features,
  routeCategories,
  routes,
  routesToRouteCategories,
} from '~/server/db/schema'
import { ascNullsEnd } from '~/server/helpers/order-by'
import { selectMultiLine } from '~/server/helpers/spatial-data/multi-line'
import {
  flattenTranslationsOnExecute,
  withTranslations,
} from '~/server/helpers/translations/query/with-translations'
import { adminProcedure, router } from '~/server/trpc'

const getAllRoutes = ({
  limit,
  offset,
  ids,
  locale,
}: {
  limit: number
  offset: number
  ids: number[]
  locale: string | null
}) =>
  flattenTranslationsOnExecute(
    db.query.routes
      .findMany(
        withTranslations({
          columns: {
            id: true,
            name: true,
            description: true,
            content: true,
            importance: true,
          },
          limit: limit,
          offset: offset,
          orderBy: asc(routes.id),
          where: (route, { inArray }) => inArray(route.id, ids),
          with: {
            mainImage: {
              columns: {
                id: true,
              },
            },
            features: withTranslations({}),
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
      .prepare('admin/routes/getAllRoutes')
  ).execute({ locale })

const getAllRouteIds = db
  .selectDistinct({ id: routes.id, importance: routes.importance })
  .from(routes)
  .leftJoin(
    routesToRouteCategories,
    eq(routes.id, routesToRouteCategories.routeId)
  )
  .where(
    and(
      or(
        isNull(sql.placeholder('categoryId')),
        eq(routes.mainCategoryId, sql.placeholder('categoryId')),
        eq(routesToRouteCategories.categoryId, sql.placeholder('categoryId'))
      ),
      or(
        isNull(sql.placeholder('query')),
        like(routes.name, sql.placeholder('query'))
      )
    )
  )
  .orderBy(ascNullsEnd(routes.importance), asc(routes.id))
  .prepare('admin/routes/getAllRouteIds')

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
          order: true,
        },
        orderBy: [ascNullsEnd(routeCategories.order)],
      })
    )
    .prepare('admin/routes/listCategories')
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
          importance: true,
        },
        extras: {
          path: selectMultiLine('path', routes.path),
        },
        where: (route, { eq }) => eq(route.id, sql.placeholder('id')),
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
          features: true,
        },
      })
    )
    .prepare('admin/routes/getRoute')
)

export const routesAdminRouter = router({
  list: adminProcedure.input(listRoutesSchema).query(async ({ input }) => {
    const preparedQuery = input.query
      ? `%${input.query.toLocaleLowerCase().replaceAll(/\s+/g, '%')}%`
      : null

    const ids = (
      await getAllRouteIds.execute({
        query: preparedQuery,
        categoryId: input.categoryId,
      })
    ).map(({ id }) => id)

    return {
      data: await getAllRoutes({
        locale: input.locale,
        offset: (input.page - 1) * input.pageSize,
        limit: input.pageSize,
        ids: ids,
      }),
      total: ids.length,
    }
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
          importance: input.importance,
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

        if (input.externalLinks.length > 0) {
          await tx.insert(externalLinks).values(
            input.externalLinks.map((externalLink) => ({
              routeId: newRouteId,
              ...externalLink,
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
            importance: input.importance,
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

        await tx.delete(externalLinks).where(eq(externalLinks.routeId, routeId))
        if (input.externalLinks.length > 0) {
          await tx.insert(externalLinks).values(
            input.externalLinks.map((externalLink) => ({
              routeId: routeId,
              ...externalLink,
            }))
          )
        }

        return routeId
      })
    }),
})
