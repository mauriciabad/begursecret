import { relations, sql } from 'drizzle-orm'
import {
  int,
  mysqlTable,
  primaryKey,
  serial,
  timestamp,
} from 'drizzle-orm/mysql-core'
import { userIdColumnType } from '../utilities'
import { users } from './users'

export const placeLists = mysqlTable('placeList', {
  id: serial('id').primaryKey(),
  userId: userIdColumnType('userId').notNull(),
})

export const placeListToPlace = mysqlTable(
  'placeListToPlace',
  {
    placeListId: int('placeListId').notNull(),
    placeId: int('placeId').notNull(),
    addedAt: timestamp('addedAt')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      pk: primaryKey(table.placeId, table.placeListId),
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
