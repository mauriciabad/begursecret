import { relations, sql } from 'drizzle-orm'
import { int, mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core'
import { pointType } from '~/server/helpers/spatial-data/point'
import { dbUserId } from '../utilities'
import { places } from './places'
import { users } from './users'

export const verifications = mysqlTable('verification', {
  id: serial('id').primaryKey(),
  placeId: int('placeId').notNull(),
  userId: dbUserId('userId').notNull(),

  validatedOn: timestamp('validatedOn')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  deviceLocation: pointType('deviceLocation'),
  deviceLocationAccuracy: int('deviceLocationAccuracy'),
})

export const verificationsRelations = relations(verifications, (r) => ({
  place: r.one(places, {
    fields: [verifications.placeId],
    references: [places.id],
  }),
  user: r.one(users, {
    fields: [verifications.userId],
    references: [users.id],
  }),
}))
