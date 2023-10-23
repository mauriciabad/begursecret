import { z } from 'zod'
import { userFieldsSchema } from './auth'

export const completeProfileSchema = z.object({
  userId: userFieldsSchema.id,
  name: userFieldsSchema.name,
})

export type CompleteProfileSchemaType = z.infer<typeof completeProfileSchema>
