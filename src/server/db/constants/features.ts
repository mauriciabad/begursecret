import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { features } from '../schema'

// Don't reorder these values, they are used to generate the database enum.
export const amountOfPeople = [
  'none',
  'few',
  'some',
  'many',
  'crowded',
] as const
export type AmountOfPeople = (typeof amountOfPeople)[number]

// Don't reorder these values, they are used to generate the database enum.
export const difficulty = [
  'accessible',
  'normal',
  'smallEffort',
  'hard',
  'dangerous',
] as const
export type Difficulty = (typeof difficulty)[number]

// Don't reorder these values, they are used to generate the database enum.
export const groundType = [
  'sand',
  'pebbles',
  'rocks',
  'concrete',
  'dirt',
  'pavimented',
] as const
export type GroundType = (typeof groundType)[number]

// Don't reorder these values, they are used to generate the database enum.
export const allowedAccess = [
  'public',
  'private',
  'customers',
  'permit',
  'permissive',
  'mixed',
] as const
export type AllowedAccess = (typeof allowedAccess)[number]

// Don't reorder these values, they are used to generate the database enum.
export const priceUnit = ['eur', 'eur/minute', 'eur/hour', 'eur/day'] as const
export type PriceUnit = (typeof priceUnit)[number]

// Don't reorder these values, they are used to generate the database enum.
export const placeToArriveFrom = [
  'townCenter',
  'parking',
  'beach',
  'road',
] as const
export type PlaceToArriveFrom = (typeof placeToArriveFrom)[number]

export type FeaturesSelect = InferSelectModel<typeof features>
export type FeaturesInsert = InferInsertModel<typeof features>
export type Features = FeaturesSelect
