export const locales = ['ca', 'en'] as const
export const defaultLocale = locales[0]

const localePathPattern = /^\/(?<locale>[^/\s]+)/

export const getLocale = (pathname: string) =>
  localePathPattern.exec(pathname)?.groups?.locale

export type LocaleRouteParams = { params: { locale: string } }
