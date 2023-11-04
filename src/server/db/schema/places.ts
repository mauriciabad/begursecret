import { relations } from 'drizzle-orm'
import {
  int,
  mysqlTable,
  primaryKey,
  text,
  tinytext,
} from 'drizzle-orm/mysql-core'
import { features } from '.'
import { pointType } from '../../helpers/spatial-data'
import { mysqlTableWithTranslations } from '../../helpers/translations/db-tables'
import {
  placeCategoriesColors,
  placeCategoriesIcons,
} from '../constants/places'
import { gender, s3ObjectKey } from '../utilities'

export const {
  normalTable: places,
  translationsTable: placesTranslations,
  makeRelationsWithTranslations: makePlaceRelations,
  translationsTableRelations: placesTranslationsRelations,
} = mysqlTableWithTranslations({
  name: 'place',
  normalColumns: {
    mainImage: s3ObjectKey('mainImage'),
    location: pointType('location').notNull(),
    mainCategoryId: int('mainCategoryId').notNull(),
    featuresId: int('featuresId'),
  },
  translatableColumns: {
    name: text('name').notNull(),
    description: tinytext('description'),
    content: text('content'), // Markdown
  },
})

export const placesRelations = relations(places, (r) => ({
  ...makePlaceRelations(r),

  mainCategory: r.one(placeCategories, {
    fields: [places.mainCategoryId],
    references: [placeCategories.id],
  }),
  categories: r.many(placesToPlaceCategories),
  features: r.one(features, {
    fields: [places.featuresId],
    references: [features.id],
  }),
}))

export const {
  normalTable: placeCategories,
  translationsTable: placeCategoriesTranslations,
  makeRelationsWithTranslations: makePlaceCategoryRelations,
  translationsTableRelations: placeCategoriesTranslationsRelations,
} = mysqlTableWithTranslations({
  name: 'placeCategory',
  normalColumns: {
    icon: tinytext('icon', { enum: placeCategoriesIcons }).notNull(),
    color: tinytext('color', { enum: placeCategoriesColors }).notNull(),
  },
  translatableColumns: {
    name: tinytext('name').notNull(),
    namePlural: tinytext('namePlural').notNull(),
    nameGender: gender('nameGender'),
  },
})

export const placeCategoriesRelations = relations(placeCategories, (r) => ({
  ...makePlaceCategoryRelations(r),

  mainPlaces: r.many(places),
  places: r.many(placesToPlaceCategories),
}))

export const placesToPlaceCategories = mysqlTable(
  'placeToPlaceCategory',
  {
    placeId: int('placeId').notNull(),
    categoryId: int('categoryId').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.placeId, table.categoryId),
    }
  }
)

export const placesToPlaceCategoriesRelations = relations(
  placesToPlaceCategories,
  ({ one }) => ({
    place: one(places, {
      fields: [placesToPlaceCategories.placeId],
      references: [places.id],
    }),
    category: one(placeCategories, {
      fields: [placesToPlaceCategories.categoryId],
      references: [placeCategories.id],
    }),
  })
)
