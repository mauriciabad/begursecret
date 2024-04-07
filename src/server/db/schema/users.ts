import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { userRoles } from '../constants/users'
import { dbUserId } from '../utilities'
import { placeLists } from './placeLists'
import { verifications } from './verifications'

export const users = pgTable('user', {
  id: dbUserId('id').notNull().primaryKey(),
  name: text('name'),
  hashedPassword: varchar('hashedPassword', { length: 255 }),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: text('role', { enum: userRoles }).default('user').notNull(),

  visitedPlaceListId: integer('visitedPlaceListId').notNull(),
})

export const usersRelations = relations(users, ({ one, many }) => ({
  visitedPlaceList: one(placeLists, {
    fields: [users.visitedPlaceListId],
    references: [placeLists.id],
  }),
  verifications: many(verifications),
}))
