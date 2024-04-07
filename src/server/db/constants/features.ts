import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { features } from '../schema'

export type FeaturesSelect = InferSelectModel<typeof features>
export type FeaturesInsert = InferInsertModel<typeof features>
export type Features = FeaturesSelect
