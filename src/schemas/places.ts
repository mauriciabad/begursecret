import { z } from 'zod'

// TODO: This file is unused, I just left it here as an example

export const addPlaceInputSchema = z.object({ title: z.string().min(1) })

export type AddPlaceInputData = z.infer<typeof addPlaceInputSchema>
