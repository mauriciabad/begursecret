/* eslint-env node */
// @ts-check
import { migrate } from 'drizzle-orm/mysql2/migrator'
import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2'
import { createConnection } from 'mysql2'

if (process.env.USE_LOCAL_DB !== 'true') {
  throw new Error(
    'Migrations are only allowed on local database. (this is a custom error)'
  )
}

const db = drizzleMysql(
  createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'unsafePaswordOnlyForLocalhost',
    database: 'descobreix-begur-app',
  })
)

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
