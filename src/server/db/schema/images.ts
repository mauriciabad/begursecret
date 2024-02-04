import { int, mysqlTable, serial, tinytext } from 'drizzle-orm/mysql-core'
import { s3ObjectKey } from '../utilities'

export const images = mysqlTable('image', {
  id: serial('id').primaryKey(),
  key: s3ObjectKey('key').notNull(),
  width: int('width').notNull(),
  height: int('height').notNull(),
  alt: tinytext('alt'), // In Catalan only
})
