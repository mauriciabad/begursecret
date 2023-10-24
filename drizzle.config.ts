import type { Config } from 'drizzle-kit'
import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

if (
  process.env.USE_LOCAL_DB !== 'true' &&
  process.env.SKIP_ENV_VALIDATION !== 'true'
) {
  if (
    !process.env.DATABASE_HOST ||
    !process.env.DATABASE_USERNAME ||
    !process.env.DATABASE_PASSWORD ||
    !process.env.DATABASE_NAME
  ) {
    throw new Error('Missing environment variables for database')
  }
}

export default {
  schema: './src/server/db/schema/*',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials:
    process.env.USE_LOCAL_DB === 'true'
      ? {
          host: '127.0.0.1',
          user: 'root',
          password: 'unsafePaswordOnlyForLocalhost',
          database: 'descobreix-begur-app',
        }
      : {
          connectionString: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?ssl={"rejectUnauthorized":true}`,
        },
} satisfies Config
