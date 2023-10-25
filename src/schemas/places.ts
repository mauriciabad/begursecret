import { z } from 'zod'
import { localesInDatabase } from '~/i18n'

export const listPlacesSchema = z.object({
  locale: z.enum(localesInDatabase),
})

export type ListPlacesInputData = z.infer<typeof listPlacesSchema>
