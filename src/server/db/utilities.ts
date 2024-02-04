import { mysqlEnum, varchar } from 'drizzle-orm/mysql-core'
import { translatableLocales } from '~/i18n'

// Don't reorder these values, they are used to generate the database enum.
const genderValues = ['masculine', 'feminine'] as const

export const s3ObjectKey = <T extends string>(name: T) =>
  varchar(name, { length: 1024 })

export const locale = <T extends string>(name: T) =>
  varchar(name, { length: 10, enum: translatableLocales })

export const gender = <T extends string>(name: T) =>
  mysqlEnum(name, genderValues)

export const userIdColumnType = <T extends string>(name: T) =>
  varchar(name, { length: 255 })
