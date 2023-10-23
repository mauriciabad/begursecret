import { z } from 'zod'

export const userFieldsSchema = {
  id: z.string().uuid(),
  name: z.string().optional(),
  email: z.string().email(),
  image: z.string().url().optional(),
  emailVerified: z.boolean().optional(),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/),
}

export const loginSchema = z.object({
  email: userFieldsSchema.email,
  password: userFieldsSchema.password,
})

export const registerSchema = z.object({
  email: userFieldsSchema.email,
  password: userFieldsSchema.password,
})

export type LoginSchemaType = z.infer<typeof loginSchema>
export type RegisterSchemaType = z.infer<typeof registerSchema>
