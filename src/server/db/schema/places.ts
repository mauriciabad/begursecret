import { type InferModel } from 'drizzle-orm'
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const places = pgTable('place', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export type Place = InferModel<typeof places>
