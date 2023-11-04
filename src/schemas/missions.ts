import { z } from 'zod'
import { translatableLocales } from '~/i18n'

export const getVisitMissionsSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
})

export type GetVisitMissionsSchemaType = z.infer<typeof getVisitMissionsSchema>
