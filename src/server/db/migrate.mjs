/* eslint-env node */
// @ts-check
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

if (process.env.USE_LOCAL_DB !== 'true') {
  throw new Error(
    'Migrations are only allowed on local database. (this is a custom error)'
  )
}

if (!process.env.DATABASE_URL)
  throw new Error('Missing environment variable DATABASE_URL')

const db = drizzlePg(postgres(process.env.DATABASE_URL))

const main = async () => {
  await migrate(db, { migrationsFolder: 'drizzle' })
}

console.info('Starting database migration.')
main()
  .then(() => {
    console.info('Database migration completed.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Database migration failed. Error:', error)
    process.exit(1)
  })
