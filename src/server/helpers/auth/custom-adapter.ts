import 'server-only'

import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '../../db/db'
import { initializeUserInDatabase } from './initialize-user'

const tempAdapter = DrizzleAdapter(db)
tempAdapter.createUser = initializeUserInDatabase

export const CustomAdapter = tempAdapter
