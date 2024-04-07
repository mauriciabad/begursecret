import dotenv from 'dotenv'
import type { Config } from 'drizzle-kit'
import path from 'node:path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

if (!process.env.DATABASE_URL)
  throw new Error('Missing environment variable DATABASE_URL')

export default {
  schema: './src/server/db/schema/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config
