import { relations } from 'drizzle-orm'
import {
  boolean,
  double,
  int,
  mysqlTable,
  primaryKey,
  text,
  tinytext,
} from 'drizzle-orm/mysql-core'
import { multiLineType } from '~/server/helpers/spatial-data/multi-line'
import { mysqlTableWithTranslations } from '../../helpers/translations/db-tables'
import { colorNames, iconNames } from '../constants/shared'
import { gender } from '../utilities'
import { externalLinks } from './externalLinks'
import { features } from './features'
import { images } from './images'
import { places } from './places'

export const {
  normalTable: routes,
  translationsTable: routesTranslations,
  makeRelationsWithTranslations: makeRouteRelations,
  translationsTableRelations: routesTranslationsRelations,
} = mysqlTableWithTranslations({
  name: 'route',
  normalColumns: {
    mainImageId: int('mainImageId'),
    path: multiLineType('path').notNull(),
    mainCategoryId: int('mainCategoryId').notNull(),
    featuresId: int('featuresId').notNull(),
    verificationRequirementsId: int('verificationRequirementsId'),
    importance: double('importance'),
  },
  translatableColumns: {
    name: text('name').notNull(),
    description: tinytext('description'),
    content: text('content'), // Markdown
  },
})

export const routesRelations = relations(routes, (r) => ({
  ...makeRouteRelations(r),

  places: r.many(routesToPlaces),
  mainImage: r.one(images, {
    fields: [routes.mainImageId],
    references: [images.id],
  }),
  mainCategory: r.one(routeCategories, {
    fields: [routes.mainCategoryId],
    references: [routeCategories.id],
    relationName: 'mainCategory',
  }),
  categories: r.many(routesToRouteCategories, {
    relationName: 'secondaryCategories',
  }),
  externalLinks: r.many(externalLinks),
  features: r.one(features, {
    fields: [routes.featuresId],
    references: [features.id],
  }),
}))

export const {
  normalTable: routeCategories,
  translationsTable: routeCategoriesTranslations,
  makeRelationsWithTranslations: makeRouteCategoryRelations,
  translationsTableRelations: routeCategoriesTranslationsRelations,
} = mysqlTableWithTranslations({
  name: 'routeCategory',
  normalColumns: {
    icon: tinytext('icon', { enum: iconNames }).notNull(),
    color: tinytext('color', { enum: colorNames }).notNull(),
    hasVisitMission: boolean('hasVisitMission').notNull().default(true),
    order: int('order'),
  },
  translatableColumns: {
    name: tinytext('name').notNull(),
    namePlural: tinytext('namePlural').notNull(),
    nameGender: gender('nameGender'),
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

export const routesToPlaces = mysqlTable(
  'routeToPlace',
  {
    routeId: int('routeId').notNull(),
    placeId: int('placeId').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.placeId, table.routeId],
      }),
    }
  }
)

export const routesToPlacesRelations = relations(routesToPlaces, ({ one }) => ({
  route: one(routes, {
    fields: [routesToPlaces.routeId],
    references: [routes.id],
    relationName: 'secondaryCategories',
  }),
  place: one(places, {
    fields: [routesToPlaces.placeId],
    references: [places.id],
  }),
}))
