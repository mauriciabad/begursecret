import { Prettify } from '../../../helpers/types'

/**
 * Places the fields in the translatedContent object into the root level.
 * If there is no translated content, it fallbacks to originalContent.
 */
export function flattenTranslationsFromSelect<
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
 *      eq(translationsTable.locale, sql`${sql.placeholder('locale')}::text`),
 *      isNull(translationsTable.locale)
 *    )
 *  )
 *  .prepare('statement_name')
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
