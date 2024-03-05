import { mysqlEnum, tinytext, varchar } from 'drizzle-orm/mysql-core'
import { translatableLocales } from '~/i18n'
import { colorNames, iconNames } from './constants/shared'

// Don't reorder these values, they are used to generate the database enum.
const genderValues = ['masculine', 'feminine'] as const

export const dbS3ObjectKey = <T extends string>(name: T) =>
  varchar(name, { length: 1024 })

export const dbLocale = <T extends string>(name: T) =>
  varchar(name, { length: 10, enum: translatableLocales })

export const dbGender = <T extends string>(name: T) =>
  mysqlEnum(name, genderValues)

export const dbUserId = <T extends string>(name: T) =>
  varchar(name, { length: 255 })

export const dbIcon = <T extends string>(name: T) =>
  tinytext(name, { enum: iconNames })

export const dbColor = <T extends string>(name: T) =>
  tinytext(name, { enum: colorNames })
