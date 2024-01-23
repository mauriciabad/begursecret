import 'server-only'

import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, getLocale } from '~/i18n'

const signInPagePathPattern = /^\/[^/\s]+\/(profile|admin-login)/

export const authI18nMiddleware = (request: NextRequest) => {
  const currentLoginPage = request.nextUrl.pathname.match(
    signInPagePathPattern
  )?.[1]
  if (!currentLoginPage) return

  const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')
  if (!callbackUrl) return

  const currentLocale = getLocale(request.nextUrl.pathname) ?? defaultLocale
  const callbackLocale = getLocale(
    new URL(callbackUrl, request.nextUrl.origin).pathname
  )
  if (callbackLocale && callbackLocale !== currentLocale) {
    const redirectUrl = new URL(request.nextUrl)
    redirectUrl.pathname = `${callbackLocale}/${currentLoginPage}`
    return NextResponse.redirect(redirectUrl)
  }
}
