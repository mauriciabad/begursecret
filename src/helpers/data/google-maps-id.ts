import { z } from 'zod'

export function makeGoogleMapsUrl<T extends string>(googleMapsId: T): T
export function makeGoogleMapsUrl(googleMapsId: null | undefined): null
export function makeGoogleMapsUrl<T extends string>(
  googleMapsId: T | null | undefined
): `https://maps.app.goo.gl/${T}` | null
export function makeGoogleMapsUrl<T extends string>(
  googleMapsId: T | null | undefined
): `https://maps.app.goo.gl/${T}` | null {
  if (googleMapsId === null || googleMapsId === undefined) return null
  return `https://maps.app.goo.gl/${googleMapsId}`
}

export const getGoogleMapsIdFromUrl = (url?: string | null) => {
  return url?.match(
    /^\s*(https?:\/\/)?maps.app.goo.gl\/(?<id>[a-zA-Z0-9_-]*)\s*$/
  )?.groups?.id
}

export const googleMapsIdSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_-]*$/, 'Invalid Google Maps ID')
