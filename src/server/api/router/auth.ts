import 'server-only'

import { TRPCError } from '@trpc/server'
import { registerSchema } from '~/schemas/auth'
import { initializeUserInDatabase } from '~/server/helpers/auth/initialize-user'
import { procedure, router } from '~/server/trpc'

export const authRouter = router({
  register: procedure.input(registerSchema).mutation(async ({ input }) => {
    console.log('register', input)
    try {
      await initializeUserInDatabase({
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
