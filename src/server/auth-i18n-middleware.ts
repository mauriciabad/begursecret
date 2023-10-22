import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, getLocale } from '~/i18n'

const signInPagePathPattern = /^\/[^/\s]+\/profile/

export const authI18nMiddleware = (request: NextRequest) => {
  if (!signInPagePathPattern.test(request.nextUrl.pathname)) return

  const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')
  if (!callbackUrl) return

  const currentLocale = getLocale(request.nextUrl.pathname) ?? defaultLocale
  const callbackLocale = getLocale(new URL(callbackUrl).pathname)
  if (callbackLocale && callbackLocale !== currentLocale) {
    const redirectUrl = new URL(request.nextUrl)
    redirectUrl.pathname = `${callbackLocale}/profile`
    return NextResponse.redirect(redirectUrl)
  }
}
