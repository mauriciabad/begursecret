import { z } from 'zod'

export const completeProfileSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1),
})

export type CompleteProfileSchemaType = z.infer<typeof completeProfileSchema>
