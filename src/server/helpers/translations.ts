/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableRelationsHelpers, relations } from 'drizzle-orm'
import {
  MySqlColumnBuilderBase,
  int,
  mysqlTable,
  serial,
} from 'drizzle-orm/mysql-core'
import { Prettify } from '../../helpers/types'
import { locale } from '../db/utilities'

/**
 * Places the fields in the translatedContent object into the root level.
 * If there is no translated content, it fallbacks to originalContent.
 */
export function flattenTranslations<
  O extends Record<string, string | null>,
  T extends O | null,
  R extends Record<string, unknown>,
>({
  translatedContent,
  originalContent,
  ...otherFields
}: R & {
  translatedContent: T
  originalContent: O
}) {
  const result = {
    ...otherFields,
    ...originalContent,
    ...translatedContent,
  }
  const prettyResult: Prettify<typeof result> = result
  return prettyResult
}

/**
 * Selects the translatable fields from the normal table and the translations table
 * @param fields - Fields to select
 * @param normalTable - Normal table
 * @param translationsTable - Translations table
 *
 * @example <caption>Example usage of selecting fields `image` and `name`.</caption>
 *  db
 *  .select({
 *    id: normalTable.id,
 *    image: normalTable.image,
 *
 *    ...selectTranslations({
 *      fields: ['name'],
 *      normalTable: normalTable,
 *      translationsTable: translationsTable,
 *    }),
 *  })
 *  .from(normalTable)
 *  .leftJoin(translationsTable, eq(normalTable.id, translationsTable.normalTableItemId))
 *  .where(
 *    or(
 *      eq(translationsTable.locale, sql.placeholder('locale')),
 *      isNull(translationsTable.locale)
 *    )
 *  )
 *  .prepare()
 */
export function selectTranslations<
  K extends Exclude<keyof DT & keyof TT, 'getSQL' | '_'>,
  TT extends Record<string, any>,
  DT extends Record<string, any>,
>({
  fields,
  normalTable,
  translationsTable,
}: {
  fields: readonly K[]
  normalTable: DT
  translationsTable: TT
}) {
  return {
    originalContent: Object.fromEntries(
      fields.map((field) => [field, normalTable[field]])
    ) as { [key in K]: DT[K] },
    translatedContent: Object.fromEntries(
      fields.map((field) => [field, translationsTable[field]])
    ) as { [key in K]: TT[K] },
  }
}

function typeDynamicKey<K extends string, V>(key: K, value: V) {
  return { [key]: value } as Record<K, V>
}

/**
 * Creates tables for the translations and it's relations.
 * The id columns is added automatically.
 *
 * The normalTable contains normal and translatable columns
 * The translationsTable contains just translatable columns
 *
 */
export function mysqlTableWithTranslations<
  Name extends string,
  NC extends Record<string, MySqlColumnBuilderBase>,
  TC extends Record<string, MySqlColumnBuilderBase>,
>({
  name,
  normalColumns,
  translatableColumns,
}: {
  name: Name
  normalColumns: NC
  translatableColumns: TC
}) {
  const normalTable = mysqlTable(name, {
    id: serial('id').primaryKey(),
    ...normalColumns,
    ...translatableColumns,
  })
  const translationsTable = mysqlTable(`${name}_translation`, {
    id: serial('id').primaryKey(),
    ...typeDynamicKey(`${name}Id`, int(`${name}_id`).notNull()),
    locale: locale('locale').notNull(),
    ...translatableColumns,
  })
  const translationsTableRelations = relations(
    translationsTable,
    ({ one }) => ({
      data: one(normalTable, {
        fields: [translationsTable[`${name}Id` as string]],
        references: [normalTable.id],
      }),
    })
  )
  const makeRelationsWithTranslations = (r: TableRelationsHelpers<Name>) => ({
    translations: r.many(translationsTable),
  })

  return {
    normalTable,
    translationsTable,
    makeRelationsWithTranslations,
    translationsTableRelations,
  }
}
