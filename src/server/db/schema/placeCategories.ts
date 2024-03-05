import { relations } from 'drizzle-orm'
import {
  boolean,
  int,
  mysqlTable,
  primaryKey,
  tinytext,
} from 'drizzle-orm/mysql-core'
import { mysqlTableWithTranslations } from '../../helpers/translations/db-tables'
import { dbColor, dbGender, dbIcon } from '../utilities'
import { places } from './places'

export const {
  normalTable: placeCategories,
  translationsTable: placeCategoriesTranslations,
  makeRelationsWithTranslations: makePlaceCategoryRelations,
  translationsTableRelations: placeCategoriesTranslationsRelations,
} = mysqlTableWithTranslations({
  name: 'placeCategory',
  normalColumns: {
    icon: dbIcon('icon').notNull(),
    color: dbColor('color').notNull(),
    hasVisitMission: boolean('hasVisitMission').notNull().default(true),
    order: int('order'),
  },
  translatableColumns: {
    name: tinytext('name').notNull(),
    namePlural: tinytext('namePlural').notNull(),
    nameGender: dbGender('nameGender'),
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
