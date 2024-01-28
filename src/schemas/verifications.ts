import { z } from 'zod'
import { numericIdSchema } from './shared'

export const verificateVisitSchema = z.object({
  placeId: numericIdSchema,
  deviceLocation: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .nullable(),
  deviceLocationAccuracy: z.number().nullable(),
})
