import { z } from 'zod'
import { translatableLocales } from '~/i18n'

export const listPlacesSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
})

export type ListPlacesInputData = z.infer<typeof listPlacesSchema>
