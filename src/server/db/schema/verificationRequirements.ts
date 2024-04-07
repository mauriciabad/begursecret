import { boolean, integer, pgTable, serial } from 'drizzle-orm/pg-core'

export const verificationRequirements = pgTable('verificationRequirement', {
  id: serial('id').primaryKey(),

  isLocationRequired: boolean('isLocationRequired').notNull().default(true),
  maxLocationDistance: integer('maxLocationDistance'),
})
