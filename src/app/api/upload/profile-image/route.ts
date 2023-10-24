import sharp from 'sharp'
import { uploadToS3 } from '~/server/aws'
import { db } from '~/server/db/db'
import { eq } from 'drizzle-orm'
import { users } from '~/server/db/schema'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '~/server/auth'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const imageFile = formData.get('image') as unknown as File | null
  if (!imageFile) {
    return NextResponse.json(
      { error: 'No image file provided' },
      { status: 400 }
    )
  }
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
  const fileKeyInS3 = `profile-images/${session.user.id}`

  const editedImageBuffer = await sharp(imageBuffer)
    .resize({ height: 256, width: 256, fit: 'cover' })
    .toBuffer()

  const imageUrl = await uploadToS3({
    buffer: editedImageBuffer,
    key: fileKeyInS3,
    contentType: imageFile.type,
  })

  await db
    .update(users)
    .set({
      image: imageUrl,
    })
    .where(eq(users.id, session.user.id))

  return NextResponse.json({ imageUrl })
}
