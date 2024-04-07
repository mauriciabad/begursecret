import { relations, TableRelationsHelpers } from 'drizzle-orm'
import {
  integer,
  PgColumnBuilderBase,
  pgTable,
  serial,
} from 'drizzle-orm/pg-core'
import { dbLocale } from '../../db/utilities'

/**
 * Creates tables for the translations and it's relations.
 * The id columns is added automatically.
 *
 * The normalTable contains normal and translatable columns
 *
 * The translationsTable contains just translatable columns
 */
export function pgTableWithTranslations<
  Name extends string,
  NC extends Record<string, PgColumnBuilderBase>,
  TC extends Record<string, PgColumnBuilderBase>,
>({
  name,
  normalColumns,
  translatableColumns,
}: {
  name: Name
  normalColumns: NC
  translatableColumns: TC
}) {
  const normalTable = pgTable(name, {
    id: serial('id').primaryKey(),
    ...normalColumns,
    ...translatableColumns,
  })
  const translationsTable = pgTable(`${name}_translation`, {
    id: serial('id').primaryKey(),
    ...typeDynamicKey(`${name}Id`, integer(`${name}_id`).notNull()),
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
