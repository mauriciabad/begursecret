import { env } from '~/env.mjs'

const BUCKET_REGION = env.NEXT_PUBLIC_AWS_BUCKET_REGION
const BUCKET_NAME = env.NEXT_PUBLIC_AWS_BUCKET_NAME
const defaultImageKey = 'static/app/content-placeholder.png'

export function makeImageUrl<T extends string>(s3key: T | null) {
  return `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${s3key ?? defaultImageKey}` as const
}
