import { relations, sql } from 'drizzle-orm'
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core'
import { dbUserId } from '../utilities'
import { places } from './places'
import { users } from './users'

export const placeLists = pgTable('placeList', {
  id: serial('id').primaryKey(),
  userId: dbUserId('userId').notNull(),
})

export const placeListToPlace = pgTable(
  'placeListToPlace',
  {
    placeListId: integer('placeListId').notNull(),
    placeId: integer('placeId').notNull(),
    addedAt: timestamp('addedAt')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.placeId, table.placeListId],
      }),
    }
  }
)

export const placeListRelations = relations(placeLists, (r) => ({
  places: r.many(placeListToPlace),
  owner: r.one(users, {
    fields: [placeLists.userId],
    references: [users.id],
  }),
}))

export const placeListToPlaceRelations = relations(placeListToPlace, (r) => ({
  place: r.one(places, {
    fields: [placeListToPlace.placeId],
    references: [places.id],
  }),
  placeList: r.one(placeLists, {
    fields: [placeListToPlace.placeListId],
    references: [placeLists.id],
  }),
}))
