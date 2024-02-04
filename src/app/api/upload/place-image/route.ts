import { withAxiom } from 'next-axiom'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { ImageType } from '~/helpers/images'
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
  const imageId = uuidv4()
  const imageKey = `contents/${imageId}`

  await procsessAndUploadToS3(imageFile, imageKey)

  // TODO: Implement db insert
  const imagedbRecord = {
    id: 123,
    key: imageKey,
    width: 123,
    height: 123,
    alt: 'Test alt WIP',
  } as const satisfies ImageType

  return NextResponse.json({
    image: imagedbRecord,
  } satisfies UploadPlaceImageResponse)
})
