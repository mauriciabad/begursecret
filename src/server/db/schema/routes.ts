import { relations } from 'drizzle-orm'
import {
  double,
  int,
  mysqlTable,
  primaryKey,
  text,
  tinytext,
} from 'drizzle-orm/mysql-core'
import { multiLineType } from '~/server/helpers/spatial-data/multi-line'
import { mysqlTableWithTranslations } from '../../helpers/translations/db-tables'
import { externalLinks } from './externalLinks'
import { features } from './features'
import { images } from './images'
import { places } from './places'
import { routeCategories, routesToRouteCategories } from './routeCategories'

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
    relationName: 'secondaryRouteToCategories',
  }),
  externalLinks: r.many(externalLinks),
  features: r.one(features, {
    fields: [routes.featuresId],
    references: [features.id],
  }),
}))

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
  }),
  place: one(places, {
    fields: [routesToPlaces.placeId],
    references: [places.id],
  }),
}))
