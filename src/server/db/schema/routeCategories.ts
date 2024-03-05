import { relations } from 'drizzle-orm'
import {
  boolean,
  int,
  mysqlTable,
  primaryKey,
  tinytext,
} from 'drizzle-orm/mysql-core'
import { mysqlTableWithTranslations } from '~/server/helpers/translations/db-tables'
import { dbColor, dbGender, dbIcon } from '../utilities'
import { routes } from './routes'

export const {
  normalTable: routeCategories,
  translationsTable: routeCategoriesTranslations,
  makeRelationsWithTranslations: makeRouteCategoryRelations,
  translationsTableRelations: routeCategoriesTranslationsRelations,
} = mysqlTableWithTranslations({
  name: 'routeCategory',
  normalColumns: {
    icon: dbIcon('icon').notNull(),
    color: dbColor('color').notNull(),
    hasVisitMission: boolean('hasVisitMission').notNull().default(true),
    order: int('order'),
  },
  translatableColumns: {
    name: tinytext('name').notNull(),
    namePlural: tinytext('namePlural').notNull(),
    nameGender: dbGender('nameGender'),
  },
})

export const routeCategoriesRelations = relations(routeCategories, (r) => ({
  ...makeRouteCategoryRelations(r),

  mainRoutes: r.many(routes, { relationName: 'mainCategory' }),
  routes: r.many(routesToRouteCategories, {
    relationName: 'secondaryCategories',
  }),
}))

export const routesToRouteCategories = mysqlTable(
  'routeToRouteCategory',
  {
    routeId: int('routeId').notNull(),
    categoryId: int('categoryId').notNull(),
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
      relationName: 'secondaryCategories',
    }),
    category: one(routeCategories, {
      fields: [routesToRouteCategories.categoryId],
      references: [routeCategories.id],
    }),
  })
)
