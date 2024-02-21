import { DriverValueMapper, sql } from 'drizzle-orm'
import { customType } from 'drizzle-orm/mysql-core'
import {
  MultiLineString,
  getMultiLine,
  multiLineToString,
} from '~/helpers/spatial-data/multi-line'
import { SRID_CODE } from '.'

// I'll wait until to fix it until they merge this PR https://github.com/drizzle-team/drizzle-orm/pull/1423
type WrongMultiLineType = MultiLineString

export const multiLineType = customType<{
  data: WrongMultiLineType
  driverData: string
}>({
  dataType() {
    return `MULTILINESTRING SRID ${SRID_CODE}`
  },
  toDriver(value: WrongMultiLineType | string) {
    const multiLine = getMultiLine(value)
    if (!multiLine)
      throw new Error(`Invalid multiLine value: ${JSON.stringify(value)}`)
    return sql`ST_MultiLineStringFromText(${multiLineToString(multiLine)}, ${SRID_CODE})`
  },
  fromDriver(value: string): WrongMultiLineType {
    const multiLine = getMultiLine(value)
    if (!multiLine)
      throw new Error(`Invalid multiLine value: ${JSON.stringify(value)}`)
    return multiLineToString(multiLine)
  },
})

export const selectMultiLine = <
  C extends string,
  D extends DriverValueMapper<D1, D2>,
  D1 = any,
  D2 = any,
>(
  column: C,
  decoder: D
) => {
  return sql<WrongMultiLineType>`ST_AsText(${sql.identifier(column)})`
    .mapWith(decoder)
    .as(column)
}
