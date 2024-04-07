import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
} from 'drizzle-orm/pg-core'
import { pgTableWithTranslations } from '../../helpers/translations/db-tables'
import { dbColor, dbGender, dbIcon } from '../utilities'
import { placeCategoriesToPlaceCategoryGroups } from './placeCategoryGroups'
import { places } from './places'

export const {
  normalTable: placeCategories,
  translationsTable: placeCategoriesTranslations,
  makeRelationsWithTranslations: makePlaceCategoryRelations,
  translationsTableRelations: placeCategoriesTranslationsRelations,
} = pgTableWithTranslations({
  name: 'placeCategory',
  normalColumns: {
    icon: dbIcon('icon').notNull(),
    color: dbColor('color').notNull(),
    hasVisitMission: boolean('hasVisitMission').notNull().default(true),
    order: integer('order'),
  },
  translatableColumns: {
    name: text('name').notNull(),
    namePlural: text('namePlural').notNull(),
    nameGender: dbGender('nameGender'),
  },
})

export const placeCategoriesRelations = relations(placeCategories, (r) => ({
  ...makePlaceCategoryRelations(r),

  mainPlaces: r.many(places, { relationName: 'mainCategory' }),
  secondaryPlaces: r.many(placesToPlaceCategories, {
    relationName: 'secondaryCategoryToPlaces',
  }),
  categoryGroups: r.many(placeCategoriesToPlaceCategoryGroups),
}))

export const placesToPlaceCategories = pgTable(
  'placeToPlaceCategory',
  {
    placeId: integer('placeId').notNull(),
    categoryId: integer('categoryId').notNull(),
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
      relationName: 'secondaryPlaceToCategories',
    }),
    category: one(placeCategories, {
      fields: [placesToPlaceCategories.categoryId],
      references: [placeCategories.id],
      relationName: 'secondaryCategoryToPlaces',
    }),
  })
)
