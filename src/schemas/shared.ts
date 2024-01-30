import { z } from 'zod'

export const numericIdSchema = z.number().positive().int()
