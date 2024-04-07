import { pgEnum } from 'drizzle-orm/pg-core'

export const genderEnum = pgEnum('gender', ['masculine', 'feminine'])
