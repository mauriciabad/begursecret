import 'server-only'

import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '../i18n'

export default getRequestConfig(async ({ locale }) => {
  if (!(locales as readonly string[]).includes(locale)) return notFound()

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Europe/Madrid',
    now: new Date(),
  }
})
