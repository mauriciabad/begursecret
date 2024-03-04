import { relations } from 'drizzle-orm'
import { boolean, int, text, tinytext } from 'drizzle-orm/mysql-core'
import { places, routes } from '.'
import { mysqlTableWithTranslations } from '../../helpers/translations/db-tables'

export const {
  normalTable: externalLinks,
  translationsTable: externalLinksTranslations,
  makeRelationsWithTranslations: makeExternalLinkRelations,
  translationsTableRelations: externalLinksTranslationsRelations,
} = mysqlTableWithTranslations({
  name: 'externalLink',
  normalColumns: {
    placeId: int('placeId'),
    routeId: int('routeId'),
    isOfficialWebsite: boolean('isOfficialWebsite'),
  },
  translatableColumns: {
    url: text('url').notNull(),
    title: tinytext('title'),
  },
})

export const externalLinksRelations = relations(externalLinks, (r) => ({
  ...makeExternalLinkRelations(r),
  place: r.one(places, {
    fields: [externalLinks.placeId],
    references: [places.id],
  }),
  route: r.one(routes, {
    fields: [externalLinks.routeId],
    references: [routes.id],
  }),
}))
