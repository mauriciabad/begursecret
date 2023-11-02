import { PointString } from '~/server/helpers/spatial-data'

export type MapPoint = {
  lat: number
  lng: number
}
/**
 * Extracts the lat and lng from a string.
 * Notice that the order is lng lat, not lat lng. Except in JSON format, where it doesn't matter.
 * @param value String in the format `lng lat`, `POINT(lng lat), `{ "lat": 1,"lng": 1 }` or `{ "x": 1,"y": 1 }`. Tere can be a comma between the values.
 * @returns Object with lat and lng properties
 */
export function getPoint(
  value: PointString | { x: number; y: number } | MapPoint
): MapPoint
export function getPoint(value: null | undefined): null
export function getPoint(
  value:
    | string
    | PointString
    | { x: number; y: number }
    | MapPoint
    | null
    | undefined
): MapPoint | null
export function getPoint(
  value:
    | string
    | PointString
    | { x: number; y: number }
    | MapPoint
    | null
    | undefined
): MapPoint | null {
  if (!value) return null
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

export function calculateLocation<
  L extends PointString | null | undefined,
  P extends { location: L },
>(place: P) {
  return {
    ...place,
    location: getPoint(place.location),
  }
}
