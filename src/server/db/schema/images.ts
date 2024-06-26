import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { dbS3ObjectKey } from '../utilities'

export const images = pgTable('image', {
  id: serial('id').primaryKey(),
  key: dbS3ObjectKey('key').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  source: text('source'),
  captureDate: timestamp('captureDate'),
  alt: text('alt'), // In Catalan only
  blurDataURL: text('blurDataURL'), // Base64 encoded image
})
