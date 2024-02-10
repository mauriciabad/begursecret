import { NextRequestWithAuth } from 'next-auth/middleware'
import { NextFetchEvent } from 'next/server'
import { authI18nMiddleware } from './server/helpers/auth/auth-i18n-middleware'
import { adminAuthMiddleware } from './server/helpers/auth/auth-middleware'
import { i18nMiddleware } from './server/i18n-middleware'

const AdminPagePathPattern = /^\/[^/\s]+\/admin(\/.*)?$/

export const middleware = (
  request: NextRequestWithAuth,
  event: NextFetchEvent
) => {
  if (AdminPagePathPattern.test(request.nextUrl.pathname)) {
    return adminAuthMiddleware(request, event, (request) => {
      return i18nMiddleware(request)
    })
  }

  const authI18nResponse = authI18nMiddleware(request)
  if (authI18nResponse) return authI18nResponse

  return i18nMiddleware(request)
}

export const config = {
  // matcher: ['/((?!api|_.*|.*\\..*).*)'],
  matcher: ['/', '/(en|ca)/:path*'],
}
