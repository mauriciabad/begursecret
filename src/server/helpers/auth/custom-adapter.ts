import 'server-only'

import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { Adapter } from 'next-auth/adapters'
import { db } from '../../db/db'
import { initializeUserInDatabase } from './initialize-user'

export const CustomAdapter = {
  ...(DrizzleAdapter(db) as Adapter),
  createUser: initializeUserInDatabase,
} satisfies Adapter
