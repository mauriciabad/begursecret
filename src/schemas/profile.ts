import { z } from 'zod'
import { userFieldsSchema } from './auth'

export const completeProfileSchema = z.object({
  userId: userFieldsSchema.id,
  name: userFieldsSchema.name,
})

export const updateProfileImageSchema = z.object({
  userId: userFieldsSchema.id,
  image: userFieldsSchema.image,
})

export const updateSessionSchema = z
  .object({
    name: userFieldsSchema.name,
    picture: userFieldsSchema.image,
  })
  .partial()

export type CompleteProfileSchemaType = z.infer<typeof completeProfileSchema>
export type UpdateProfileImageSchemaType = z.infer<
  typeof updateProfileImageSchema
>
export type UpdateSessionSchemaType = z.infer<typeof updateSessionSchema>
