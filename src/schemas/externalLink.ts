import { z } from 'zod'

export const externalLinkSchema = z.object({
  url: z.string().url(),
  title: z.string().optional().nullable(),
  isOfficialWebsite: z.boolean().optional().nullable(),
})
