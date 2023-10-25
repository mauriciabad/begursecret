export const localesInDatabase = [
  'ca',
  'en',
] as const satisfies readonly string[]
export const locales = ['ca', 'en'] as const satisfies readonly [
  ...typeof localesInDatabase,
  ...string[],
]
export const defaultLocale = 'ca' satisfies (typeof locales)[number]

function isLocaleInDatabase(
  locale: string
): locale is (typeof localesInDatabase)[number] {
  return localesInDatabase.some((l) => l === locale)
}

export function localeOrDefault<T extends string>(locale: T) {
  return isLocaleInDatabase(locale) ? locale : defaultLocale
}

const localePathPattern = /^\/(?<locale>[^/\s]+)/

export const getLocale = (pathname: string) =>
  localePathPattern.exec(pathname)?.groups?.locale

export type LocaleRouteParams = { params: { locale: string } }
