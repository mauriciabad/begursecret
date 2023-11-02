import { relations } from 'drizzle-orm'
import {
  int,
  mysqlTable,
  primaryKey,
  text,
  tinytext,
} from 'drizzle-orm/mysql-core'
import { pointType } from '../../helpers/spatial-data'
import { mysqlTableWithTranslations } from '../../helpers/translations'
import {
  placeCategoriesColors,
  placeCategoriesIcons,
} from '../constants/places'
import { s3ObjectKey } from '../utilities'

export const {
  normalTable: places,
  translationsTable: placesTranslations,
  normalTableRelations: placesRelations,
  translationsTableRelations: placesTranslationsRelations,
} = mysqlTableWithTranslations({
  name: 'place',
  normalColumns: {
    mainImage: s3ObjectKey('mainImage'),
    location: pointType('location').notNull(),
    mainCategoryId: int('mainCategoryId').notNull(),
  },
  translatableColumns: {
    name: text('name').notNull(),
  },
})

export const {
  normalTable: placeCategories,
  translationsTable: placeCategoriesTranslations,
  normalTableRelations: placeCategoriesDataRelations,
  translationsTableRelations: placeCategoriesTranslationsRelations,
} = mysqlTableWithTranslations({
  name: 'placeCategory',
  normalColumns: {
    icon: tinytext('icon', { enum: placeCategoriesIcons }).notNull(),
    color: tinytext('color', { enum: placeCategoriesColors }).notNull(),
  },
  translatableColumns: {
    name: tinytext('name').notNull(),
  },
})

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

export const placesRelations2 = relations(places, ({ one }) => ({
  mainCategory: one(placeCategories, {
    fields: [places.mainCategoryId],
    references: [placeCategories.id],
  }),
}))

export const placesRelations3 = relations(places, ({ many }) => ({
  placesToPlaceCategories: many(placesToPlaceCategories),
}))

export const placeCategoriesRelations2 = relations(
  placeCategories,
  ({ many }) => ({
    placesToPlaceCategories: many(placesToPlaceCategories),
  })
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
