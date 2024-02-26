import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import {
  multiLineSchema,
  multilineFromGeoJsonString,
} from '~/helpers/spatial-data/multi-line'
import { translatableLocales } from '~/i18n'
import { features } from '~/server/db/schema'
import { numericIdSchema } from './shared'

export const listRoutesSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
})

export const getRoutesSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
  id: numericIdSchema,
})

export const listCategoriesSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
})

export const createRouteSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional().nullable(),
  mainCategory: z.coerce.number().positive('Required').int(),
  categories: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return []
      return value.split(',').map(Number)
    })
    .pipe(z.array(numericIdSchema)),
  path: z
    .string()
    .min(3, 'Required')
    .transform(multilineFromGeoJsonString)
    .pipe(multiLineSchema),
  importance: z.coerce.number().gt(0).optional().nullable(),
  content: z.string().optional().nullable(),
  features: createInsertSchema(features),
})

export const editRouteSchema = createRouteSchema.extend({
  id: numericIdSchema,
})

export type ListRoutesInputData = z.infer<typeof listRoutesSchema>
export type GetRoutesInputData = z.infer<typeof getRoutesSchema>
export type ListCategoriesInputData = z.infer<typeof listCategoriesSchema>
export type CreateRouteInputData = z.infer<typeof createRouteSchema>
export type EditRouteInputData = z.infer<typeof editRouteSchema>
