import {
  date,
  int,
  mysqlTable,
  serial,
  text,
  tinytext,
} from 'drizzle-orm/mysql-core'
import { dbS3ObjectKey } from '../utilities'

export const images = mysqlTable('image', {
  id: serial('id').primaryKey(),
  key: dbS3ObjectKey('key').notNull(),
  width: int('width').notNull(),
  height: int('height').notNull(),
  source: text('source'),
  captureDate: date('captureDate'),
  alt: tinytext('alt'), // In Catalan only
  blurDataURL: text('blurDataURL'), // Base64 encoded image
})
