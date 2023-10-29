import { text } from 'drizzle-orm/mysql-core'
import { mysqlTableWithTranslations } from '../../helpers/translations'
import { s3ObjectKey } from '../utilities'
import { pointType } from '../../helpers/spatial-data'

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
