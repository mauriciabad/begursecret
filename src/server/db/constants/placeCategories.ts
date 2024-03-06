import { InferSelectModel } from 'drizzle-orm'
import { placeCategories } from '../schema'

export type PlaceCategoriesSelect = InferSelectModel<typeof placeCategories>
export type PlaceCategory = PlaceCategoriesSelect
