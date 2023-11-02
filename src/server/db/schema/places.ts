import { int, text, tinytext } from 'drizzle-orm/mysql-core'
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
  normalTableRelations: placesDataRelations,
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
