/* eslint-disable @typescript-eslint/no-explicit-any */
import { DriverValueMapper, sql } from 'drizzle-orm'
import { customType } from 'drizzle-orm/mysql-core'
import { MapPoint } from '~/helpers/spatial-data'

// ETRS89 UTM zone 31 North
const SRID_CODE = 25831

export const pointType = customType<{
  data: MapPoint
  driverData: { x: number; y: number }
}>({
  dataType() {
    return 'point'
  },
  toDriver(value: MapPoint | string) {
    const point = getPoint(value)
    if (!point) throw new Error(`Invalid point value: ${JSON.stringify(value)}`)
    return sql`ST_PointFromText('POINT(${point.lng} ${point.lat})', ${SRID_CODE})`
  },
  fromDriver(value: { x: number; y: number } | `POINT(${number} ${number})`) {
    const point = getPoint(value)
    if (!point) throw new Error(`Invalid point value: ${JSON.stringify(value)}`)
    return point
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
  return sql<MapPoint>`ST_AsText(${sql.identifier(column)})`
    .mapWith(decoder)
    .as(column)
}

/**
 * Extracts the lat and lng from a string.
 * Notice that the order is lng lat, not lat lng. Except in JSON format, where it doesn't matter.
 * @param value String in the format `lng lat`, `POINT(lng lat), `{ "lat": 1,"lng": 1 }` or `{ "x": 1,"y": 1 }`. Tere can be a comma between the values.
 * @returns Object with lat and lng properties
 */
function getPoint(
  value: string | { x: number; y: number } | MapPoint
): MapPoint | null {
  if (typeof value === 'string') {
    try {
      return getPoint(JSON.parse(value))
    } catch (e) {
      // Ignore
    }

    const matches = value.match(/(?<lng>[\d.-]+) *,? +(?<lat>[\d.-]+)/)
    if (!matches?.groups?.['lat'] || !matches?.groups?.['lng']) {
      return null
    }
    return {
      lat: parseFloat(String(matches.groups['lat'])),
      lng: parseFloat(String(matches.groups['lng'])),
    }
  }

  if ('x' in value && 'y' in value && value?.x && value?.y) {
    return {
      lat: value.y,
      lng: value.x,
    }
  }

  if ('lat' in value && 'lng' in value && value?.lat && value?.lng) {
    return {
      lat: value.lat,
      lng: value.lng,
    }
  }

  return null
}
