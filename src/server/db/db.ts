import 'server-only'
import { env } from '~/env.mjs'

import { connect } from '@planetscale/database'
import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2'
import {
  PlanetScaleDatabase,
  drizzle as drizzlePlanetscale,
} from 'drizzle-orm/planetscale-serverless'
import { createConnection } from 'mysql2'
import * as schema from './schema'

export const db =
  env.USE_LOCAL_DB === 'true'
    ? (drizzleMysql(
        createConnection({
          host: '127.0.0.1',
          user: 'root',
          password: 'unsafePaswordOnlyForLocalhost',
          database: 'descobreix-begur-app',
        }),
        {
          schema,
          mode: 'planetscale',
        }
        // TODO: Remove this unsafe type cast when this issue is fixed:
        // https://github.com/drizzle-team/drizzle-orm/issues/1129
      ) as unknown as PlanetScaleDatabase<typeof schema>)
    : drizzlePlanetscale(
        connect({
          host: env.DATABASE_HOST,
          username: env.DATABASE_USERNAME,
          password: env.DATABASE_PASSWORD,
        }),
        { schema }
      )
