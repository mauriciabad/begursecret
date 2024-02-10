import 'server-only'

import { NextResponse } from 'next/server'
import { deleteFromS3, uploadToS3 } from '../aws'

type ExtractGenericFromNextResponse<Type> =
  Type extends NextResponse<infer X> ? X : never
export type NextResponseType<T extends (...args: any) => any> =
  ExtractGenericFromNextResponse<Awaited<ReturnType<T>>>

type UploadOptions = {
  generateBlurDataURL?: boolean
  appendFileTypeToKey?: boolean
}
export async function procsessAndUploadToS3<K extends string>(
  file: File,
  key: K,
  options?: UploadOptions
) {
  const imageBuffer = Buffer.from(await file.arrayBuffer())

  const editedImageBuffer = imageBuffer

  const format = 'png'
  if (!format) throw new Error('Error getting image metadata: format')
  const width = 999
  if (!width) throw new Error('Error getting image metadata: width')
  const height = 999
  if (!height) throw new Error('Error getting image metadata: height')

  const keyWithFileType = options?.appendFileTypeToKey
    ? (`${key}.${format}` as const)
    : key

  const blurDataURL = undefined

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
