import { httpBatchLink } from '@trpc/react-query'

import { env } from '~/env.mjs'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''
  return `https://${env.BASE_URL}`
}

export const createLink = () =>
  httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })
