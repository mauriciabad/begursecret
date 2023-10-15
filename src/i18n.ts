export const locales = ['en', 'ca'] as const
export const defaultLocale = 'ca'

const localePathPattern = /^\/(?<locale>[^/\s]+)/

export const getLocale = (pathname: string) =>
  localePathPattern.exec(pathname)?.groups?.locale

export type LocaleRouteParams = { params: { locale: string } }
