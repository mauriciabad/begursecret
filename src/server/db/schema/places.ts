import { mysqlTable, serial, text } from 'drizzle-orm/mysql-core'

export const places = mysqlTable('place', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
})
