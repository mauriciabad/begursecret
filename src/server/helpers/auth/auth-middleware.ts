import {
  NextMiddlewareWithAuth,
  NextRequestWithAuth,
  withAuth,
} from 'next-auth/middleware'
import { NextFetchEvent } from 'next/server'

export const adminAuthMiddleware = (
  request: NextRequestWithAuth,
  event: NextFetchEvent,
  middleware: NextMiddlewareWithAuth
) =>
  withAuth(middleware, {
    callbacks: {
      authorized: ({ token }) => {
        if (!token) {
          console.error('adminAuthMiddleware: User has no token')
          return false
        }

        if (!token.role) {
          console.error(
            `adminAuthMiddleware: User "${token.id}" (${token.email}) has no role`
          )
          return false
        }

        return token.role === 'admin'
      },
    },
    pages: {
      signIn: '/admin-login',
    },
  })(request, event)
