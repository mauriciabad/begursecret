import { relations } from 'drizzle-orm'
import { boolean, integer, text } from 'drizzle-orm/pg-core'
import { places, routes } from '.'
import { pgTableWithTranslations } from '../../helpers/translations/db-tables'

export const {
  normalTable: externalLinks,
  translationsTable: externalLinksTranslations,
  makeRelationsWithTranslations: makeExternalLinkRelations,
  translationsTableRelations: externalLinksTranslationsRelations,
} = pgTableWithTranslations({
  name: 'externalLink',
  normalColumns: {
    placeId: integer('placeId'),
    routeId: integer('routeId'),
    isOfficialWebsite: boolean('isOfficialWebsite'),
  },
  translatableColumns: {
    url: text('url').notNull(),
    title: text('title'),
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
