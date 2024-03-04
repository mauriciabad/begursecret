import { relations } from 'drizzle-orm'
import { boolean, serial, text, tinytext } from 'drizzle-orm/mysql-core'
import { mysqlTableWithTranslations } from '../../helpers/translations/db-tables'

export const {
  normalTable: externalLinks,
  translationsTable: externalLinksTranslations,
  makeRelationsWithTranslations: makeExternalLinkRelations,
  translationsTableRelations: externalLinksTranslationsRelations,
} = mysqlTableWithTranslations({
  name: 'externalLink',
  normalColumns: {
    id: serial('id').primaryKey(),
    isOfficialWebsite: boolean('isOfficialWebsite'),
  },
  translatableColumns: {
    url: text('url').notNull(),
    title: tinytext('title'),
  },
})

export const externalLinksRelations = relations(externalLinks, (r) => ({
  ...makeExternalLinkRelations(r),
}))
