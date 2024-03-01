export const translatableLocales = ['en'] as const satisfies readonly string[]
export const defaultLocale = 'ca' satisfies string
export const locales = [
  defaultLocale,
  ...translatableLocales,
] as const satisfies readonly string[]
export type Locales = (typeof locales)[number]

function isTranslatableLocale(
  locale: string
): locale is (typeof translatableLocales)[number] {
  return translatableLocales.some((l) => l === locale)
}

export function onlyTranslatableLocales<T extends string>(locale: T) {
  return isTranslatableLocale(locale) ? locale : null
}

const localePathPattern = /^\/(?<locale>[^/\s]+)/

export const getLocale = (pathname: string) =>
  localePathPattern.exec(pathname)?.groups?.locale

export type LocaleParams = { locale: string }
export type LocaleRouteParams<
  T extends Record<string, unknown> = Record<string, never>,
> = {
  params: LocaleParams & T
}

export const localePrefix = 'always'

export function isLocale<L extends Locales>(locale: L | unknown): locale is L {
  return (
    !!locale &&
    typeof locale === 'string' &&
    (locales as readonly string[]).includes(locale)
  )
}

export function parseLocale<L extends Locales>(locale: L | unknown) {
  return isLocale(locale) ? locale : defaultLocale
}
