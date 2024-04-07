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
import { placeCategories } from './placeCategories'

export const {
  normalTable: placeCategoryGroups,
  translationsTable: placeCategoryGroupsTranslations,
  makeRelationsWithTranslations: makePlaceCategoryGroupRelations,
  translationsTableRelations: placeCategoryGroupsTranslationsRelations,
} = pgTableWithTranslations({
  name: 'placeCategoryGroup',
  normalColumns: {
    icon: dbIcon('icon').notNull(),
    color: dbColor('color').notNull(),
    order: integer('order'),
  },
  translatableColumns: {
    name: text('name').notNull(),
    nameGender: dbGender('nameGender'),
  },
})

export const placeCategoryGroupsRelations = relations(
  placeCategoryGroups,
  (r) => ({
    ...makePlaceCategoryGroupRelations(r),

    placeCategories: r.many(placeCategoriesToPlaceCategoryGroups),
  })
)

export const placeCategoriesToPlaceCategoryGroups = pgTable(
  'placeCategoryToPlaceCategoryGroup',
  {
    categoryGroupId: integer('categoryGroupId').notNull(),
    categoryId: integer('categoryId').notNull(),
    highlight: boolean('highlight'),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.categoryGroupId, table.categoryId],
      }),
    }
  }
)

export const placeCategoriesToPlaceCategoryGroupsRelations = relations(
  placeCategoriesToPlaceCategoryGroups,
  ({ one }) => ({
    categoryGroup: one(placeCategoryGroups, {
      fields: [placeCategoriesToPlaceCategoryGroups.categoryGroupId],
      references: [placeCategoryGroups.id],
    }),
    category: one(placeCategories, {
      fields: [placeCategoriesToPlaceCategoryGroups.categoryId],
      references: [placeCategories.id],
    }),
  })
)
