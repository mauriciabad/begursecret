import { z } from 'zod'
import { translatableLocales } from '~/i18n'

export const listPlacesSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
})

export const searchPlacesSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
  category: z.number().min(1).int().nullable(),
})

export const getPlacesSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
  id: z.number().min(1).int(),
})

export const listCategoriesSchema = z.object({
  locale: z.enum(translatableLocales).nullable(),
})

export const createPlaceSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3).optional(),
  mainCategory: z.coerce.number(),
  categories: z
    .string()
    .transform((value) => value.split(',').map(Number))
    .pipe(z.array(z.number())),
  location: z
    .string()
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
})

export type ListPlacesInputData = z.infer<typeof listPlacesSchema>
export type GetPlacesInputData = z.infer<typeof getPlacesSchema>
export type SearchPlacesInputData = z.infer<typeof searchPlacesSchema>
export type ListCategoriesInputData = z.infer<typeof listCategoriesSchema>
export type CreatePlaceInputData = z.infer<typeof createPlaceSchema>
