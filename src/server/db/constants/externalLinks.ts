import { InferSelectModel } from 'drizzle-orm'
import { externalLinks } from '../schema'

type ExternalLinksSelect = InferSelectModel<typeof externalLinks>
export type ExternalLink = ExternalLinksSelect
