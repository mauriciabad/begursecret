// @ts-check
import { migrate } from 'drizzle-orm/mysql2/migrator'
import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2'
import { createConnection } from 'mysql2'

const db = drizzleMysql(
  createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'unsafePaswordOnlyForLocalhost',
    database: 'descobreixbegurapp',
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
