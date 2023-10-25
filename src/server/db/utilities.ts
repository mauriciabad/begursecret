import { varchar } from 'drizzle-orm/mysql-core'
import { localesInDatabase } from '../../i18n'

export const s3ObjectKey = <T extends string>(name: T) =>
  varchar(name, { length: 1024 })

export const locale = <T extends string>(name: T) =>
  varchar(name, { length: 10, enum: localesInDatabase })
