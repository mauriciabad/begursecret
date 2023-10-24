import 'server-only'

import { S3 } from 'aws-sdk'
import { env } from '~/env.mjs'

export const BUCKET_REGION = 'eu-west-1'
export const BUCKET_NAME = 'descobreix-begur-app-g3qf4o'

export const s3 = new S3({
  region: BUCKET_REGION,
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
})
