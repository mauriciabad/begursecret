import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
} from 'drizzle-orm/pg-core'
import { pgTableWithTranslations } from '~/server/helpers/translations/db-tables'
import { dbColor, dbGender, dbIcon } from '../utilities'
import { routes } from './routes'

export const {
  normalTable: routeCategories,
  translationsTable: routeCategoriesTranslations,
  makeRelationsWithTranslations: makeRouteCategoryRelations,
  translationsTableRelations: routeCategoriesTranslationsRelations,
} = pgTableWithTranslations({
  name: 'routeCategory',
  normalColumns: {
    icon: dbIcon('icon').notNull(),
    color: dbColor('color').notNull(),
    hasVisitMission: boolean('hasVisitMission').notNull().default(true),
    order: integer('order'),
  },
  translatableColumns: {
    name: text('name').notNull(),
    namePlural: text('namePlural').notNull(),
    nameGender: dbGender('nameGender'),
  },
})

export const routeCategoriesRelations = relations(routeCategories, (r) => ({
  ...makeRouteCategoryRelations(r),

  mainRoutes: r.many(routes, { relationName: 'mainCategory' }),
  secondaryRoutes: r.many(routesToRouteCategories, {
    relationName: 'secondaryCategoryToRoutes',
  }),
}))

export const routesToRouteCategories = pgTable(
  'routeToRouteCategory',
  {
    routeId: integer('routeId').notNull(),
    categoryId: integer('categoryId').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.categoryId, table.routeId],
      }),
    }
  }
)

export const routesToRouteCategoriesRelations = relations(
  routesToRouteCategories,
  ({ one }) => ({
    route: one(routes, {
      fields: [routesToRouteCategories.routeId],
      references: [routes.id],
      relationName: 'secondaryRouteToCategories',
    }),
    category: one(routeCategories, {
      fields: [routesToRouteCategories.categoryId],
      references: [routeCategories.id],
      relationName: 'secondaryCategoryToRoutes',
    }),
  })
)
