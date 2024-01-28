import { z } from 'zod'

export const numericIdSchema = z.number().min(1).int()
