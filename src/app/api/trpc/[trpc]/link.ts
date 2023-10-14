import { httpBatchLink } from '@trpc/react-query'

import { env } from '~/env.mjs'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''
  if (env.BASE_URL) return `https://${env.BASE_URL}`
  return `http://localhost:${env.PORT ?? 3000}`
}

export const createLink = () =>
  httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })
