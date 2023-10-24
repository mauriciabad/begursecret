import 'server-only'

import { eq } from 'drizzle-orm'
import {
  completeProfileSchema,
  updateProfileImageSchema,
} from '~/schemas/profile'
import { db } from '~/server/db/db'
import { users } from '~/server/db/schema/users'
import { protectedProcedure, router } from '~/server/trpc'
import { BUCKET_NAME, s3 } from '~/aws'

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
  getSignedUrlForUploadImage: protectedProcedure.mutation(async ({ ctx }) => {
    return s3.createPresignedPost({
      Bucket: BUCKET_NAME,
      Fields: {
        key: `profile-images/${ctx.session.user.id}`,
      },
      Expires: 60,
      Conditions: [
        ['content-length-range', 0, 2000000], // 2MB
        ['starts-with', '$Content-Type', 'image/'],
        { acl: 'public-read' },
      ],
    })
  }),
})
