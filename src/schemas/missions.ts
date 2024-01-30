import { z } from 'zod'
import { translatableLocales } from '~/i18n'
import { numericIdSchema } from './shared'

export const getVisitMissionsSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
  placeId: numericIdSchema.optional(),
})

export type GetVisitMissionsSchemaType = z.infer<typeof getVisitMissionsSchema>
