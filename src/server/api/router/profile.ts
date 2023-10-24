import 'server-only'

import { eq } from 'drizzle-orm'
import {
  completeProfileSchema,
  updateProfileImageSchema,
} from '~/schemas/profile'
import { db } from '~/server/db/db'
import { users } from '~/server/db/schema/users'
import { protectedProcedure, router } from '~/server/trpc'

export const profileRouter = router({
  completeProfile: protectedProcedure
    .input(completeProfileSchema)
    .mutation(async ({ input, ctx }) => {
      return db
        .update(users)
        .set({
          name: input.name,
        })
        .where(eq(users.id, ctx.session.user.id))
    }),
  updateProfileImage: protectedProcedure
    .input(updateProfileImageSchema)
    .mutation(async ({ input, ctx }) => {
      return db
        .update(users)
        .set({
          image: input.image,
        })
        .where(eq(users.id, ctx.session.user.id))
    }),
})
