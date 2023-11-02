import { DriverValueMapper, sql } from 'drizzle-orm'
import { customType } from 'drizzle-orm/mysql-core'
import { getPoint } from '../../helpers/spatial-data'

// ETRS89 UTM zone 31 North
const SRID_CODE = 25831

export type PointString = `POINT(${number} ${number})`

// TODO: This type should be MapPoint, but for some reason it is not working
// I'll wait until to fix it until they merge this PR https://github.com/drizzle-team/drizzle-orm/pull/1423
type WrongPointType = PointString

export const pointType = customType<{
  data: WrongPointType
  driverData: string
}>({
  dataType() {
    return `POINT SRID ${SRID_CODE}`
  },
  toDriver(value: WrongPointType | string) {
    const point = getPoint(value)
    if (!point) throw new Error(`Invalid point value: ${JSON.stringify(value)}`)
    return sql`ST_PointFromText('POINT(${point.lng} ${point.lat})', ${SRID_CODE})`
  },
  fromDriver(value: string): WrongPointType {
    const point = getPoint(value)
    if (!point) throw new Error(`Invalid point value: ${JSON.stringify(value)}`)
    return `POINT(${point.lng} ${point.lat})`
  },
})

export const selectPoint = <
  C extends string,
  D extends DriverValueMapper<D1, D2>,
  D1 = any,
  D2 = any,
>(
  column: C,
  decoder: D
) => {
  return sql<WrongPointType>`ST_AsText(${sql.identifier(column)})`
    .mapWith(decoder)
    .as(column)
}
