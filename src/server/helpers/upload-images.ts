import 'server-only'

import { NextResponse } from 'next/server'
import sharp, { Sharp } from 'sharp'
import { deleteFromS3, uploadToS3 } from '../aws'

type ExtractGenericFromNextResponse<Type> =
  Type extends NextResponse<infer X> ? X : never
export type NextResponseType<T extends (...args: any) => any> =
  ExtractGenericFromNextResponse<Awaited<ReturnType<T>>>

type UploadOptions = {
  process?: (sharpImg: Sharp) => Sharp
  generateBlurDataURL?: boolean
  appendFileTypeToKey?: boolean
}
export async function procsessAndUploadToS3<K extends string>(
  file: File,
  key: K,
  options?: UploadOptions
) {
  const imageBuffer = Buffer.from(await file.arrayBuffer())

  const editedImageBuffer = options?.process
    ? await options.process(sharp(imageBuffer)).toBuffer()
    : imageBuffer

  const metadata = await sharp(editedImageBuffer).metadata()
  const format = metadata.format
  if (!format) throw new Error('Error getting image metadata: format')
  const width = metadata.width
  if (!width) throw new Error('Error getting image metadata: width')
  const height = metadata.height
  if (!height) throw new Error('Error getting image metadata: height')

  const keyWithFileType = options?.appendFileTypeToKey
    ? (`${key}.${format}` as const)
    : key

  const blurDataURL = options?.generateBlurDataURL
    ? await sharp(editedImageBuffer)
        .resize(10, 10, { fit: 'inside' })
        .toBuffer()
        .then((buffer) => `data:${format};base64,${buffer.toString('base64')}`)
    : undefined

  const src = await uploadToS3({
    buffer: editedImageBuffer,
    key: keyWithFileType,
    contentType: format,
  })

  return {
    src,
    key: keyWithFileType,
    width,
    height,
    blurDataURL,
  }
}

export async function proccessAndUploadOrDeleteFromS3<K extends string>(
  file: File | null,
  key: K,
  options?: UploadOptions
) {
  if (file) {
    return await procsessAndUploadToS3(file, key, options)
  } else {
    await deleteFromS3({
      key,
    })
    return null
  }
}
