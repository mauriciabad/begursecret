import { mysqlTable, serial, text, varchar } from 'drizzle-orm/mysql-core'

export const places = mysqlTable('place', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  mainImage: varchar('mainImage', { length: 1024 }).notNull(),
})
