import sharp from 'sharp'
import { deleteFromS3, uploadToS3 } from '~/server/aws'
import { db } from '~/server/db/db'
import { eq } from 'drizzle-orm'
import { users } from '~/server/db/schema'
import { NextResponse } from 'next/server'
import { getSession } from '~/server/get-server-thing'
import { withAxiom } from 'next-axiom'

export const POST = withAxiom(async (request) => {
  const session = await getSession()
  if (!session) {
    return NextResponse.json(null, { status: 401 })
  }

  const formData = await request.formData()
  const imageFile = formData.get('image') as unknown as File | null

  const imageUrl = await uploadOrDeleteFromS3(
    imageFile,
    `profile-images/${session.user.id}`
  )

  await db
    .update(users)
    .set({
      image: imageUrl,
    })
    .where(eq(users.id, session.user.id))

  return NextResponse.json({ imageUrl })
})

type ExtractGenericFromNextResponse<Type> = Type extends NextResponse<infer X>
  ? X
  : never
export type UploadProfileImageResponse = ExtractGenericFromNextResponse<
  Awaited<ReturnType<typeof POST>>
>

async function uploadOrDeleteFromS3<K extends string>(
  file: File | null,
  key: K
) {
  if (file) {
    const imageBuffer = Buffer.from(await file.arrayBuffer())

    const editedImageBuffer = await sharp(imageBuffer)
      .resize({ height: 256, width: 256, fit: 'cover' })
      .toBuffer()

    return await uploadToS3({
      buffer: editedImageBuffer,
      key,
      contentType: file.type,
    })
  } else {
    await deleteFromS3({
      key,
    })

    return null
  }
}
