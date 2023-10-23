import 'server-only'

import { eq } from 'drizzle-orm'
import {
  completeProfileSchema,
  updateProfileImageSchema,
} from '~/schemas/profile'
import { db } from '~/server/db/db'
import { users } from '~/server/db/schema/users'
import { procedure, router } from '~/server/trpc'

export const profileRouter = router({
  completeProfile: procedure
    .input(completeProfileSchema)
    .mutation(async ({ input }) => {
      return db
        .update(users)
        .set({
          name: input.name,
        })
        .where(eq(users.id, input.userId))
    }),
  updateProfileImage: procedure
    .input(updateProfileImageSchema)
    .mutation(async ({ input }) => {
      return db
        .update(users)
        .set({
          image: input.image,
        })
        .where(eq(users.id, input.userId))
    }),
})
