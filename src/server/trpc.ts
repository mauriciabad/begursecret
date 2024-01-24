import { TRPCError, initTRPC } from '@trpc/server'
import 'server-only'
import superjson from 'superjson'

import { getSession } from './get-server-thing'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createContext = async (_req: Request) => {
  const session = await getSession()
  return { session }
}

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware

export const protectedProcedure = publicProcedure.use(
  middleware(({ ctx, next }) => {
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
)

export const adminProcedure = publicProcedure.use(
  middleware(({ ctx, next }) => {
    if (ctx.session?.user.role !== 'admin') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Procedure requires authentication and admin permissions',
      })
    }
    return next({
      ctx: {
        session: ctx.session,
      },
    })
  })
)
