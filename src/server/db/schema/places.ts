import { relations } from 'drizzle-orm'
import {
  boolean,
  int,
  mysqlTable,
  primaryKey,
  text,
  tinytext,
} from 'drizzle-orm/mysql-core'
import { pointType } from '../../helpers/spatial-data'
import { mysqlTableWithTranslations } from '../../helpers/translations/db-tables'
import {
  placeCategoriesColors,
  placeCategoriesIcons,
} from '../constants/places'
import { gender, s3ObjectKey } from '../utilities'
import { features } from './features'
import { placeListToPlace } from './placeLists'
import { verificationRequirements } from './verificationRequirements'
import { verifications } from './verifications'

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
    verificationRequirementsId: int('verificationRequirementsId'),
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
    relationName: 'main',
  }),
  categories: r.many(placesToPlaceCategories, {
    relationName: 'secondary',
  }),
  features: r.one(features, {
    fields: [places.featuresId],
    references: [features.id],
  }),
  placeLists: r.many(placeListToPlace),
  verificationRequirements: r.one(verificationRequirements, {
    fields: [places.verificationRequirementsId],
    references: [verificationRequirements.id],
  }),
  verifications: r.many(verifications),
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
    hasVisitMission: boolean('hasVisitMission').notNull().default(true),
  },
  translatableColumns: {
    name: tinytext('name').notNull(),
    namePlural: tinytext('namePlural').notNull(),
    nameGender: gender('nameGender'),
  },
})

export const placeCategoriesRelations = relations(placeCategories, (r) => ({
  ...makePlaceCategoryRelations(r),

  mainPlaces: r.many(places, { relationName: 'main' }),
  places: r.many(placesToPlaceCategories, {
    relationName: 'secondary',
  }),
}))

export const placesToPlaceCategories = mysqlTable(
  'placeToPlaceCategory',
  {
    placeId: int('placeId').notNull(),
    categoryId: int('categoryId').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.categoryId, table.placeId],
      }),
    }
  }
)

export const placesToPlaceCategoriesRelations = relations(
  placesToPlaceCategories,
  ({ one }) => ({
    place: one(places, {
      fields: [placesToPlaceCategories.placeId],
      references: [places.id],
      relationName: 'secondary',
    }),
    category: one(placeCategories, {
      fields: [placesToPlaceCategories.categoryId],
      references: [placeCategories.id],
    }),
  })
)
