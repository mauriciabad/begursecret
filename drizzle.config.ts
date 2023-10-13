import type { Config } from 'drizzle-kit'

export default {
  schema: './src/server/db/schema/*',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    host: '127.0.0.1',
    user: 'root',
    password: 'unsafePaswordOnlyForLocalhost',
    database: 'descobreixbegurapp',
  },
} satisfies Config
