import {
  Column,
  DBQueryConfig,
  TableRelationalConfig,
  TablesRelationalConfig,
  and,
  eq,
  isNotNull,
  sql,
} from 'drizzle-orm'
import { doSomethingAfterExecute } from '../on-execute'
import { flattenTranslations } from './flatten'

export function withTranslations<
  TRelationType extends 'one' | 'many',
  TIsRoot extends boolean,
  TSchema extends TablesRelationalConfig,
  TFields extends TableRelationalConfig,
  C extends DBQueryConfig<TRelationType, TIsRoot, TSchema, TFields>,
  TranslationsTableColumns extends Record<string, Column>,
>(config: C) {
  return {
    ...config,

    with: {
      translations: {
        columns: config.columns,
        where: (translations: TranslationsTableColumns) =>
          and(
            isNotNull(sql`${sql.placeholder('locale')}::text`),
            eq(translations.locale, sql`${sql.placeholder('locale')}::text`)
          ),
      },

      ...config.with,
    },
  }
}

export function flattenTranslationsOnExecute<
  P extends { execute: (...args: any[]) => Promise<any> },
>(preparedStatement: P) {
  return doSomethingAfterExecute(
    preparedStatement,
    flattenTranslations as any
  ) as P
}
