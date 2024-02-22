import { relations } from 'drizzle-orm'
import {
  boolean,
  double,
  int,
  mysqlEnum,
  text,
  tinytext,
} from 'drizzle-orm/mysql-core'
import { mysqlTableWithTranslations } from '../../helpers/translations/db-tables'
import {
  allowedAccess,
  amountOfPeople,
  difficulty,
  groundType,
  placeToArriveFrom,
  priceUnit,
} from '../constants/features'

export const {
  normalTable: features,
  translationsTable: featuresTranslations,
  makeRelationsWithTranslations: makeFeatureRelations,
  translationsTableRelations: featuresTranslationsRelations,
} = mysqlTableWithTranslations({
  name: 'feature',
  normalColumns: {
    amountOfPeople: mysqlEnum('amountOfPeople', amountOfPeople),
    difficulty: mysqlEnum('difficulty', difficulty),
    groundType: mysqlEnum('groundType', groundType),

    hasBus: boolean('hasBus'),
    hasParking: boolean('hasParking'),
    parkingSpaces: int('parkingSpaces'),
    hasToilet: boolean('hasToilet'),
    hasRestaurant: boolean('hasRestaurant'),
    hasDrinkingWater: boolean('hasDrinkingWater'),
    hasShower: boolean('hasShower'),
    hasLifeguard: boolean('hasLifeguard'),
    hasLeisure: boolean('hasLeisure'),
    isNudist: boolean('isNudist'),
    hasUnofficialName: boolean('hasUnofficialName'),
    isOutOfTheMunicipality: boolean('isOutOfTheMunicipality'),
    allowedAccess: mysqlEnum('allowedAccess', allowedAccess),
    dimensions: tinytext('dimensions'),
    price: double('price'),
    priceUnit: mysqlEnum('priceUnit', priceUnit),
    isCovered: boolean('isCovered'),
    duration: int('duration'), // In minutes
    distance: int('distance'), // In meters
    slope: int('slope'), // In meters
    timeToArrive: int('timeToArrive'), // In minutes
    placeToArriveFrom: mysqlEnum('placeToArriveFrom', placeToArriveFrom),
    isFreeWithLocalStamp: boolean('isFreeWithLocalStamp'),
  },
  translatableColumns: {
    difficultyNotes: text('difficultyNotes'), // Markdown
    priceNotes: text('priceNotes'), // Markdown
    allowedAccessNotes: text('allowedAccessNotes'), // Markdown
  },
})

export const featuresRelations = relations(features, (r) => ({
  ...makeFeatureRelations(r),
}))
