import createMiddleware from 'next-intl/middleware'
import { defaultLocale, localePrefix, locales } from '~/i18n'

export const i18nMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix,
})
