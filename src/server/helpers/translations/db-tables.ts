import { relations, TableRelationsHelpers } from 'drizzle-orm'
import {
  int,
  MySqlColumnBuilderBase,
  mysqlTable,
  serial,
} from 'drizzle-orm/mysql-core'
import { dbLocale } from '../../db/utilities'

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
    locale: dbLocale('locale').notNull(),
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

function typeDynamicKey<K extends string, V>(key: K, value: V) {
  return { [key]: value } as Record<K, V>
}
