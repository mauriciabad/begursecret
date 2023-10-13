import { mysqlTable, serial, text, timestamp } from 'drizzle-orm/mysql-core'

export const places = mysqlTable('place', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
