import { TRPCError, initTRPC } from '@trpc/server'
import 'server-only'
import superjson from 'superjson'

import { auth } from './auth'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createContext = async (_req: Request) => {
  const session = await auth()
  return { session }
}

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
})

export const router = t.router
export const procedure = t.procedure
export const middleware = t.middleware

const authenticatedMiddleware = middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Procedure requires authentication',
    })
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  })
})

export const protectedProcedure = procedure.use(authenticatedMiddleware)
