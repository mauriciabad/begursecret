import { relations } from 'drizzle-orm'
import {
  doublePrecision,
  integer,
  pgTable,
  primaryKey,
  text,
} from 'drizzle-orm/pg-core'
import { multiLineType } from '~/server/helpers/spatial-data/multi-line'
import { pgTableWithTranslations } from '../../helpers/translations/db-tables'
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
} = pgTableWithTranslations({
  name: 'route',
  normalColumns: {
    mainImageId: integer('mainImageId'),
    path: multiLineType('path').notNull(),
    mainCategoryId: integer('mainCategoryId').notNull(),
    featuresId: integer('featuresId').notNull(),
    verificationRequirementsId: integer('verificationRequirementsId'),
    importance: doublePrecision('importance'),
  },
  translatableColumns: {
    name: text('name').notNull(),
    description: text('description'),
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

export const routesToPlaces = pgTable(
  'routeToPlace',
  {
    routeId: integer('routeId').notNull(),
    placeId: integer('placeId').notNull(),
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
