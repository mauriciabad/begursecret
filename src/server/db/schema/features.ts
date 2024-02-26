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
  howNarrow,
  placeToArriveFrom,
  priceUnit,
  scubaDivingLevel,
  trainingLevel,
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
    hasInacurateLocation: boolean('hasInacurateLocation'),
    date: tinytext('date'),
    isBoatOnly: boolean('isBoatOnly'),
    trainingLevel: mysqlEnum('trainingLevel', trainingLevel),
    hasMissingInfo: boolean('hasMissingInfo'),
    height: int('height'), // In meters
    depth: int('depth'), // In meters
    depthMin: int('depthMin'), // In meters
    depthMax: int('depthMax'), // In meters
    scubaDivingLevel: mysqlEnum('scubaDivingLevel', scubaDivingLevel),
    notThereAnymore: boolean('notThereAnymore'),
    isOutOfTheMunicipality: boolean('isOutOfTheMunicipality'),
    hasBench: boolean('hasBench'),
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
    howNarrow: mysqlEnum('howNarrow', howNarrow),
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
