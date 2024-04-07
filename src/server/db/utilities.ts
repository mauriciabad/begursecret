import { text, varchar } from 'drizzle-orm/pg-core'
import { translatableLocales } from '~/i18n'
import { colorNames, iconNames } from './constants/shared'
import { genderEnum } from './schema/utils'

export const dbS3ObjectKey = <T extends string>(name: T) =>
  varchar(name, { length: 1024 })

export const dbLocale = <T extends string>(name: T) =>
  varchar(name, { length: 10, enum: translatableLocales })

export const dbGender = <T extends string>(name: T) => genderEnum(name)

export const dbUserId = <T extends string>(name: T) =>
  varchar(name, { length: 255 })

export const dbIcon = <T extends string>(name: T) =>
  text(name, { enum: iconNames })

export const dbColor = <T extends string>(name: T) =>
  text(name, { enum: colorNames })
