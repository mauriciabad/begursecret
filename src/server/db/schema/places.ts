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
import { pointType } from '../../helpers/spatial-data/point'
import { mysqlTableWithTranslations } from '../../helpers/translations/db-tables'
import { colorNames, iconNames } from '../constants/shared'
import { gender } from '../utilities'
import { externalLinks } from './externalLinks'
import { features } from './features'
import { images } from './images'
import { placeListToPlace } from './placeLists'
import { routesToPlaces } from './routes'
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

export const placesRelations = relations(places, (r) => ({
  ...makePlaceRelations(r),

  routes: r.many(routesToPlaces),
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
  externalLinks: r.many(externalLinks),
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
