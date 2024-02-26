import { sql, type AnyColumn, type SQLWrapper } from 'drizzle-orm'

export function ascNullsEnd(column: SQLWrapper | AnyColumn) {
  return sql`ISNULL(${column}), ${column} asc`
}

export function descNullsEnd(column: SQLWrapper | AnyColumn) {
  return sql`ISNULL(${column}), ${column} desc`
}

export function ascNullsStart(column: SQLWrapper | AnyColumn) {
  return sql`NOT ISNULL(${column}), ${column} asc`
}

export function descNullsStart(column: SQLWrapper | AnyColumn) {
  return sql`NOT ISNULL(${column}), ${column} desc`
}
