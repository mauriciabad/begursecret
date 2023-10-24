import 'server-only'

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { env } from '~/env.mjs'

export const BUCKET_REGION = 'eu-west-1'
export const BUCKET_NAME = 'descobreix-begur-app-g3qf4o'

export const s3 = new S3Client({
  region: BUCKET_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

export async function uploadToS3<K extends string>({
  buffer,
  key,
  contentType,
}: {
  buffer: Buffer
  key: K
  contentType: string
}) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )
  return `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${key}` as const
}

export async function deleteFromS3<K extends string>({ key }: { key: K }) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  )
}
