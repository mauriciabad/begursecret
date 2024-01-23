import { relations } from 'drizzle-orm'
import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core'
import { userRoles } from '../constants/users'
import { userIdColumnType } from '../utilities'
import { placeLists } from './placeLists'
import { verifications } from './verifications'

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
  role: varchar('role', {
    length: 255,
    enum: userRoles,
  })
    .default('user')
    .notNull(),

  visitedPlaceListId: int('visitedPlaceListId').notNull(),
})

export const usersRelations = relations(users, ({ one, many }) => ({
  visitedPlaceList: one(placeLists, {
    fields: [users.visitedPlaceListId],
    references: [placeLists.id],
  }),
  verifications: many(verifications),
}))
