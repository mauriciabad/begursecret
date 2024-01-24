import 'server-only'

import { TRPCError } from '@trpc/server'
import { registerSchema } from '~/schemas/auth'
import { initializeUserInDatabase } from '~/server/helpers/auth/initialize-user'
import { publicProcedure, router } from '~/server/trpc'

export const authRouter = router({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      try {
        return await initializeUserInDatabase({
          email: input.email,
          password: input.password,
        })
      } catch (e) {
        return new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: (e as Error).message,
        })
      }
    }),
})
