import { text } from 'drizzle-orm/mysql-core'
import { pointType } from '../../helpers/spatial-data'
import { mysqlTableWithTranslations } from '../../helpers/translations'
import { s3ObjectKey } from '../utilities'

export const {
  normalTable: places,
  translationsTable: placesTranslations,
  normalTableRelations: placesDataRelations,
  translationsTableRelations: placesTranslationsRelations,
} = mysqlTableWithTranslations({
  name: 'place',
  normalColumns: {
    mainImage: s3ObjectKey('mainImage'),
    location: pointType('location').notNull(),
  },
  translatableColumns: {
    name: text('name').notNull(),
  },
})
