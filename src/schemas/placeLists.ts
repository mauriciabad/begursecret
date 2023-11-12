import { z } from 'zod'
import { translatableLocales } from '~/i18n'

export const addToVisitedPlacesListSchema = z.object({
  placeId: z.number().int().min(0).optional(),
})

export const getVisitedPlacesSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
})

export type AddToVisitedPlacesListSchemaType = z.infer<
  typeof addToVisitedPlacesListSchema
>
export type GetVisitedPlacesSchemaType = z.infer<typeof getVisitedPlacesSchema>
