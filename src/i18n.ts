export const locales = ['en', 'ca']
export const defaultLocale = 'ca'

const localePathPattern = /^\/(?<locale>[^/\s]+)/

export const getLocale = (pathname: string) =>
  localePathPattern.exec(pathname)?.groups?.locale
