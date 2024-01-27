import { eq } from 'drizzle-orm'
import { withAxiom } from 'next-axiom'
import { NextResponse } from 'next/server'
import { db } from '~/server/db/db'
import { users } from '~/server/db/schema'
import { getSession } from '~/server/get-server-thing'
import { proccessAndUploadOrDeleteFromS3 } from '~/server/helpers/upload-images'

// TODO: Replace when issue gets solved
// https://github.com/axiomhq/next-axiom/pull/162
// export type UploadProfileImageResponse = NextResponseType<typeof POST>
export type UploadProfileImageResponse = { imageUrl: string }

export const POST = withAxiom(async (request) => {
  const session = await getSession()
  if (!session) {
    return NextResponse.json(null, { status: 401 })
  }

  const formData = await request.formData()
  const imageFile = formData.get('image') as unknown as File | null

  const imageUrl = await proccessAndUploadOrDeleteFromS3(
    imageFile,
    `profile-images/${session.user.id}`,
    (sharpImg) => sharpImg.resize({ height: 256, width: 256, fit: 'cover' })
  )

  await db
    .update(users)
    .set({
      image: imageUrl,
    })
    .where(eq(users.id, session.user.id))

  return NextResponse.json({ imageUrl })
})
