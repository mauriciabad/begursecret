import { relations } from 'drizzle-orm'
import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core'
import { userIdColumnType } from '../utilities'
import { placeLists } from './placeLists'

export const users = mysqlTable('user', {
  id: userIdColumnType('id').notNull().primaryKey(),
  name: varchar('name', { length: 255 }),
  hashedPassword: varchar('hashedPassword', { length: 255 }),
  email: varchar('email', { length: 255 }).unique().notNull(),
  emailVerified: timestamp('emailVerified', {
    mode: 'date',
    fsp: 3,
  }),
  image: varchar('image', { length: 255 }),

  visitedPlaceListId: int('visitedPlaceListId').notNull(),
})

export const usersRelations = relations(users, ({ one }) => ({
  visitedPlaceList: one(placeLists, {
    fields: [users.visitedPlaceListId],
    references: [placeLists.id],
  }),
}))
