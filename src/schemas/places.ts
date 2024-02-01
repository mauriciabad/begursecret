import { z } from 'zod'
import { translatableLocales } from '~/i18n'
import { numericIdSchema } from './shared'

export const listPlacesSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
})

export const searchPlacesSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
  category: numericIdSchema.nullable(),
})

export const getPlacesSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
  id: numericIdSchema,
})

export const listCategoriesSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
})

export const createPlaceSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  mainCategory: z.coerce.number().positive('Required').int(),
  categories: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return []
      return value.split(',').map(Number)
    })
    .pipe(z.array(numericIdSchema)),
  location: z
    .string()
    .min(3, 'Required')
    .transform((value) => {
      const [lat, lng] = value.split(',')
      return { lat: Number(lat), lng: Number(lng) }
    })
    .pipe(
      z.object({
        lat: z.number(),
        lng: z.number(),
      })
    ),
  mainImage: z.string().optional(),
  content: z.string().optional(),
})

export const editPlaceSchema = createPlaceSchema.extend({
  id: numericIdSchema,
})

export type ListPlacesInputData = z.infer<typeof listPlacesSchema>
export type GetPlacesInputData = z.infer<typeof getPlacesSchema>
export type SearchPlacesInputData = z.infer<typeof searchPlacesSchema>
export type ListCategoriesInputData = z.infer<typeof listCategoriesSchema>
export type CreatePlaceInputData = z.infer<typeof createPlaceSchema>
export type EditPlaceInputData = z.infer<typeof editPlaceSchema>
