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
import { gender } from '../utilities'
import { features } from './features'
import { images } from './images'
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
    mainImageId: int('mainImageId'),
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

  mainImage: r.one(images, {
    fields: [places.mainImageId],
    references: [images.id],
  }),
  mainCategory: r.one(placeCategories, {
    fields: [places.mainCategoryId],
    references: [placeCategories.id],
    relationName: 'mainCategory',
  }),
  categories: r.many(placesToPlaceCategories, {
    relationName: 'secondaryCategories',
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

  mainPlaces: r.many(places, { relationName: 'mainCategory' }),
  places: r.many(placesToPlaceCategories, {
    relationName: 'secondaryCategories',
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
      relationName: 'secondaryCategories',
    }),
    category: one(placeCategories, {
      fields: [placesToPlaceCategories.categoryId],
      references: [placeCategories.id],
    }),
  })
)
