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

export type ListPlacesInputData = z.infer<typeof listPlacesSchema>
export type GetPlacesInputData = z.infer<typeof getPlacesSchema>
export type SearchPlacesInputData = z.infer<typeof searchPlacesSchema>
export type ListCategoriesInputData = z.infer<typeof listCategoriesSchema>
