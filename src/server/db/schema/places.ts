import { relations } from 'drizzle-orm'
import { double, int, text, tinytext } from 'drizzle-orm/mysql-core'
import { pointType } from '../../helpers/spatial-data/point'
import { mysqlTableWithTranslations } from '../../helpers/translations/db-tables'
import { externalLinks } from './externalLinks'
import { features } from './features'
import { images } from './images'
import { placeCategories, placesToPlaceCategories } from './placeCategories'
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
    googleMapsId: text('googleMapsId'),
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
    relationName: 'secondaryPlaceToCategories',
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
