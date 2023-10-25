import { relations } from 'drizzle-orm'
import { mysqlTable, serial, text } from 'drizzle-orm/mysql-core'
import { locale, s3ObjectKey } from '../utilities'

export const placesData = mysqlTable('place_data', {
  id: serial('id').primaryKey(),
  mainImage: s3ObjectKey('mainImage'),
})

export const placesTranslations = mysqlTable('place_translation', {
  id: serial('id').primaryKey(),
  placeId: serial('place_id').notNull(),
  locale: locale('locale').notNull(),

  name: text('name').notNull(),
})

export const placesDataRelations = relations(placesData, ({ many }) => ({
  translations: many(placesTranslations),
}))

export const placesTranslationsRelations = relations(
  placesTranslations,
  ({ one }) => ({
    data: one(placesData, {
      fields: [placesTranslations.placeId],
      references: [placesData.id],
    }),
  })
)
