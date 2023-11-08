import { z } from 'zod'

export const verificateVisitSchema = z.object({
  placeId: z.number().min(1).int(),
  deviceLocation: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .nullable(),
  deviceLocationAccuracy: z.number().nullable(),
})
