import { z } from 'zod'

export const addToVisitedPlacesListSchema = z.object({
  placeId: z.number().int().min(0).optional(),
})

export type AddToVisitedPlacesListSchemaType = z.infer<
  typeof addToVisitedPlacesListSchema
>
