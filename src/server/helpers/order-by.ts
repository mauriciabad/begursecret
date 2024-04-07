import { sql, type AnyColumn, type SQLWrapper } from 'drizzle-orm'

export function ascNullsEnd(column: SQLWrapper | AnyColumn) {
  return sql`${column} ASC NULLS LAST`
}
