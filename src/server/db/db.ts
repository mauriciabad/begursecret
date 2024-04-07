import 'server-only'
import { env } from '~/env.mjs'

import { neon } from '@neondatabase/serverless'
import { drizzle as drizzleNeon, NeonHttpDatabase } from 'drizzle-orm/neon-http'
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export const db =
  env.USE_LOCAL_DB === 'true'
    ? (drizzlePg(postgres(env.DATABASE_URL), {
        schema,
        // TODO: Remove this unsafe type cast when this issue is fixed:
        // https://github.com/drizzle-team/drizzle-orm/issues/1129
      }) as unknown as NeonHttpDatabase<typeof schema>)
    : drizzleNeon(neon(env.DATABASE_URL), { schema })
