import { getRequestConfig } from 'next-intl/server'
import 'server-only'
import { defaultLocale } from '~/i18n'

export default getRequestConfig(async ({ locale = defaultLocale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default,
  timeZone: 'Europe/Madrid',
  now: new Date(),
}))
