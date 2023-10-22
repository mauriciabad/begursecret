import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8)
  .max(100)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/)

export const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
})

export const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
})

export type LoginSchemaType = z.infer<typeof loginSchema>
export type RegisterSchemaType = z.infer<typeof registerSchema>
