import { relations } from 'drizzle-orm'
import {
  boolean,
  doublePrecision,
  integer,
  pgEnum,
  text,
} from 'drizzle-orm/pg-core'
import { pgTableWithTranslations } from '../../helpers/translations/db-tables'

export const amountOfPeopleEnum = pgEnum('amountOfPeople', [
  'none',
  'few',
  'some',
  'many',
  'crowded',
])
export const amountOfPeople = amountOfPeopleEnum.enumValues
export type AmountOfPeople = (typeof amountOfPeople)[number]

export const difficultyEnum = pgEnum('difficulty', [
  'accessible',
  'normal',
  'smallEffort',
  'hard',
  'dangerous',
])
export const difficulty = difficultyEnum.enumValues
export type Difficulty = (typeof difficulty)[number]

export const howNarrowEnum = pgEnum('howNarrow', [
  'extremlyNarrow',
  'narrow',
  'extraSpace',
  'wide',
  'veryWide',
])
export const howNarrow = howNarrowEnum.enumValues
export type HowNarrow = (typeof howNarrow)[number]

export const groundTypeEnum = pgEnum('groundType', [
  'sand',
  'pebbles',
  'rocks',
  'concrete',
  'dirt',
  'pavimented',
])
export const groundType = groundTypeEnum.enumValues
export type GroundType = (typeof groundType)[number]

export const allowedAccessEnum = pgEnum('allowedAccess', [
  'public',
  'permissive',
  'customers',
  'permit',
  'private',
  'mixed',
])
export const allowedAccess = allowedAccessEnum.enumValues
export type AllowedAccess = (typeof allowedAccess)[number]

export const trainingLevelEnum = pgEnum('trainingLevel', [
  'noTraining',
  'amateur',
  'entryLevel',
  'advanced',
  'professional',
  'elite',
])
export const trainingLevel = trainingLevelEnum.enumValues
export type TrainingLevel = (typeof trainingLevel)[number]

export const scubaDivingLevelEnum = pgEnum('scubaDivingLevel', [
  'discoverScubaDiving',
  'openWater',
  'advancedOpenWater',
  'specialtyDiver',
  'technicalDiver',
])
export const scubaDivingLevel = scubaDivingLevelEnum.enumValues
export type ScubaDivingLevel = (typeof scubaDivingLevel)[number]

export const priceUnitEnum = pgEnum('priceUnit', [
  'eur',
  'eur/minute',
  'eur/hour',
  'eur/day',
])
export const priceUnit = priceUnitEnum.enumValues
export type PriceUnit = (typeof priceUnit)[number]

export const placeToArriveFromEnum = pgEnum('placeToArriveFrom', [
  'townCenter',
  'parking',
  'beach',
  'road',
])
export const placeToArriveFrom = placeToArriveFromEnum.enumValues
export type PlaceToArriveFrom = (typeof placeToArriveFrom)[number]

export const {
  normalTable: features,
  translationsTable: featuresTranslations,
  makeRelationsWithTranslations: makeFeatureRelations,
  translationsTableRelations: featuresTranslationsRelations,
} = pgTableWithTranslations({
  name: 'feature',
  normalColumns: {
    amountOfPeople: amountOfPeopleEnum('amountOfPeopleEnum'),
    difficulty: difficultyEnum('difficulty'),
    groundType: groundTypeEnum('groundType'),

    hasBus: boolean('hasBus'),
    hasParking: boolean('hasParking'),
    parkingSpaces: integer('parkingSpaces'),
    hasToilet: boolean('hasToilet'),
    hasRestaurant: boolean('hasRestaurant'),
    hasDrinkingWater: boolean('hasDrinkingWater'),
    hasShower: boolean('hasShower'),
    hasLifeguard: boolean('hasLifeguard'),
    hasLeisure: boolean('hasLeisure'),
    isNudist: boolean('isNudist'),
    hasUnofficialName: boolean('hasUnofficialName'),
    hasInacurateLocation: boolean('hasInacurateLocation'),
    date: text('date'),
    isBoatOnly: boolean('isBoatOnly'),
    trainingLevel: trainingLevelEnum('trainingLevel'),
    hasMissingInfo: boolean('hasMissingInfo'),
    height: integer('height'), // In meters
    depth: integer('depth'), // In meters
    depthMin: integer('depthMin'), // In meters
    depthMax: integer('depthMax'), // In meters
    scubaDivingLevel: scubaDivingLevelEnum('scubaDivingLevel'),
    notThereAnymore: boolean('notThereAnymore'),
    isOutOfTheMunicipality: boolean('isOutOfTheMunicipality'),
    hasBench: boolean('hasBench'),
    allowedAccess: allowedAccessEnum('allowedAccess'),
    dimensions: text('dimensions'),
    price: doublePrecision('price'),
    priceUnit: priceUnitEnum('priceUnit'),
    isCovered: boolean('isCovered'),
    duration: integer('duration'), // In minutes
    distance: integer('distance'), // In meters
    slope: integer('slope'), // In meters
    timeToArrive: integer('timeToArrive'), // In minutes
    placeToArriveFrom: placeToArriveFromEnum('placeToArriveFrom'),
    isFreeWithLocalStamp: boolean('isFreeWithLocalStamp'),
    howNarrow: howNarrowEnum('howNarrow'),
  },
  translatableColumns: {
    difficultyNotes: text('difficultyNotes'), // Markdown
    priceNotes: text('priceNotes'), // Markdown
    allowedAccessNotes: text('allowedAccessNotes'), // Markdown
    hasInacurateLocationNotes: text('hasInacurateLocationNotes'), // Markdown
    hasMissingInfoNotes: text('hasMissingInfoNotes'), // Markdown
    notThereAnymoreNotes: text('notThereAnymoreNotes'), // Markdown
  },
})

export const featuresRelations = relations(features, (r) => ({
  ...makeFeatureRelations(r),
}))
