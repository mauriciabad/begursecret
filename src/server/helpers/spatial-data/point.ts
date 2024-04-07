import { DriverValueMapper, sql } from 'drizzle-orm'
import { customType } from 'drizzle-orm/pg-core'
import {
  PointString,
  getPoint,
  pointToString,
} from '~/helpers/spatial-data/point'
import { SRID_CODE } from '.'

// TODO: This type should be MapPoint, but for some reason it is not working
// I'll wait until to fix it until they merge this PR https://github.com/drizzle-team/drizzle-orm/pull/1423
type WrongPointType = PointString

export const pointType = customType<{
  data: WrongPointType
  driverData: string
}>({
  dataType() {
    return `Geometry(Point,${SRID_CODE})`
  },
  toDriver(value: WrongPointType | string) {
    const point = getPoint(value)
    if (!point) throw new Error(`Invalid point value: ${JSON.stringify(value)}`)
    return sql`ST_GeomFromText('${pointToString(point)}',${SRID_CODE})`
  },
  fromDriver(value: string): WrongPointType {
    const point = getPoint(value)
    if (!point) throw new Error(`Invalid point value: ${JSON.stringify(value)}`)
    return pointToString(point)
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
