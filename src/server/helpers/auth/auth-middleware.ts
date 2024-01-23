import 'server-only'

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
        return token?.role === 'admin'
      },
    },
    pages: {
      signIn: '/admin-login',
    },
  })(request, event)
