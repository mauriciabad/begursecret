export const translatableLocales = ['en'] as const satisfies readonly string[]
export const defaultLocale = 'ca' satisfies string
export const locales = [
  defaultLocale,
  ...translatableLocales,
] as const satisfies readonly string[]

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

export type LocaleRouteParams = { params: { locale: string } }
