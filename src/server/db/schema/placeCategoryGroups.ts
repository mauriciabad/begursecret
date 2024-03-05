import { relations } from 'drizzle-orm'
import { int, mysqlTable, primaryKey, tinytext } from 'drizzle-orm/mysql-core'
import { mysqlTableWithTranslations } from '../../helpers/translations/db-tables'
import { dbColor, dbGender, dbIcon } from '../utilities'
import { placeCategories } from './placeCategories'

export const {
  normalTable: placeCategoryGroups,
  translationsTable: placeCategoryGroupsTranslations,
  makeRelationsWithTranslations: makePlaceCategoryGroupRelations,
  translationsTableRelations: placeCategoryGroupsTranslationsRelations,
} = mysqlTableWithTranslations({
  name: 'placeCategoryGroup',
  normalColumns: {
    icon: dbIcon('icon').notNull(),
    color: dbColor('color').notNull(),
    order: int('order'),
  },
  translatableColumns: {
    name: tinytext('name').notNull(),
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

export const placeCategoriesToPlaceCategoryGroups = mysqlTable(
  'placeCategoryToPlaceCategoryGroup',
  {
    categoryGroupId: int('categoryGroupId').notNull(),
    categoryId: int('categoryId').notNull(),
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
