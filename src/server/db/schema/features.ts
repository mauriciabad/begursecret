import { relations } from 'drizzle-orm'
import { boolean, mysqlEnum, text, tinytext } from 'drizzle-orm/mysql-core'
import { mysqlTableWithTranslations } from '../../helpers/translations/db-tables'
import { amountOfPeople, difficulty, groundType } from '../constants/features'

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
    hasToilet: boolean('hasToilet'),
    hasRestaurant: boolean('hasRestaurant'),
    hasDrinkingWater: boolean('hasDrinkingWater'),
    hasShower: boolean('hasShower'),
    hasLifeguard: boolean('hasLifeguard'),
    hasLeisure: boolean('hasLeisure'),

    dimensions: tinytext('dimensions'),
  },
  translatableColumns: {
    difficultyNotes: text('difficultyNotes'), // Markdown
  },
})

export const featuresRelations = relations(features, (r) => ({
  ...makeFeatureRelations(r),
}))
