import 'server-only'

import { NextResponse } from 'next/server'
import sharp, { Sharp } from 'sharp'
import { deleteFromS3, uploadToS3 } from '../aws'

type ExtractGenericFromNextResponse<Type> =
  Type extends NextResponse<infer X> ? X : never
export type NextResponseType<T extends (...args: any) => any> =
  ExtractGenericFromNextResponse<Awaited<ReturnType<T>>>

export async function procsessAndUploadToS3<K extends string>(
  file: File,
  key: K,
  process?: (sharpImg: Sharp) => Sharp
) {
  const imageBuffer = Buffer.from(await file.arrayBuffer())

  const editedImageBuffer = process
    ? await process(sharp(imageBuffer)).toBuffer()
    : imageBuffer

  return await uploadToS3({
    buffer: editedImageBuffer,
    key,
    contentType: file.type,
  })
}

export async function proccessAndUploadOrDeleteFromS3<K extends string>(
  file: File | null,
  key: K,
  process?: (sharpImg: Sharp) => Sharp
) {
  if (file) {
    return await procsessAndUploadToS3(file, key, process)
  } else {
    await deleteFromS3({
      key,
    })
    return null
  }
}
