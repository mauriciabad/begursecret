import 'server-only'

import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { router } from '~/server/trpc'
import { adminRouter } from './admin'
import { authRouter } from './auth'
import { missionsRouter } from './missions'
import { placeListsRouter } from './placeLists'
import { placesRouter } from './places'
import { profileRouter } from './profile'
import { verificationsRouter } from './verifications'

export const apiRouter = router({
  admin: adminRouter,

  places: placesRouter,
  auth: authRouter,
  profile: profileRouter,
  missions: missionsRouter,
  placeLists: placeListsRouter,
  verifications: verificationsRouter,
})

export type ApiRouter = typeof apiRouter

export type ApiRouterInput = inferRouterInputs<ApiRouter>
export type ApiRouterOutput = inferRouterOutputs<ApiRouter>
