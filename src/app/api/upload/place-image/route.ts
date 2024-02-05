import { withAxiom } from 'next-axiom'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { ImageType } from '~/helpers/images'
import { db } from '~/server/db/db'
import { images } from '~/server/db/schema'
import { getSession } from '~/server/get-server-thing'
import { procsessAndUploadToS3 } from '~/server/helpers/upload-images'

// TODO: Replace when issue gets solved
// https://github.com/axiomhq/next-axiom/pull/162
// export type UploadPlaceImageResponse = NextResponseType<typeof POST>
export type UploadPlaceImageResponse = { image: ImageType }

export const POST = withAxiom(async (request) => {
  const session = await getSession()
  if (session?.user.role !== 'admin') {
    return NextResponse.json(null, { status: 401 })
  }

  const formData = await request.formData()
  const imageFile = formData.get('image') as unknown as File | null
  if (!imageFile) {
    return NextResponse.json(null, { status: 400 })
  }
  const alt = formData.get('alt') as unknown as string | undefined

  const image = await procsessAndUploadToS3(imageFile, `contents/${uuidv4()}`, {
    generateBlurDataURL: true,
    appendFileTypeToKey: true,
  })

  const insertImageResult = await db
    .insert(images)
    .values({
      ...image,
      alt,
    })
    .execute()
  const imageId = Number(insertImageResult.insertId)

  return NextResponse.json({
    image: {
      id: imageId,
      ...image,
    },
  } satisfies UploadPlaceImageResponse)
})
