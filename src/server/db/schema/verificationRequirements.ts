import { boolean, int, mysqlTable, serial } from 'drizzle-orm/mysql-core'

export const verificationRequirements = mysqlTable('verificationRequirement', {
  id: serial('id').primaryKey(),

  isLocationRequired: boolean('isLocationRequired').notNull().default(true),
  maxLocationDistance: int('maxLocationDistance'),
})
