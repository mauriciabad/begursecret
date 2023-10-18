import createIntlMiddleware from 'next-intl/middleware'

import { defaultLocale, locales } from '~/i18n'

export const i18nMiddleware = createIntlMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
})
