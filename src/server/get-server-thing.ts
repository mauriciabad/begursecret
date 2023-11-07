import 'server-only'

import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import { getServerSession } from 'next-auth'
import { apiRouter } from './api/router'
import { authOptions } from './auth'

export async function getTrpc() {
  const session = await getSession()
  const trpcServerSide = apiRouter.createCaller({
    session,
  })
  return trpcServerSide
}

export function getSession(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions)
}
