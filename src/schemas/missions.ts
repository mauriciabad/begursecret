import { z } from 'zod'
import { translatableLocales } from '~/i18n'

export const getVisitMissionsSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
  placeId: z.number().int().min(0).optional(),
})

export type GetVisitMissionsSchemaType = z.infer<typeof getVisitMissionsSchema>
