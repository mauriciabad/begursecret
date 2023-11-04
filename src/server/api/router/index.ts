import 'server-only'

import { router } from '~/server/trpc'
import { authRouter } from './auth'
import { missionsRouter } from './missions'
import { placesRouter } from './places'
import { profileRouter } from './profile'

export const apiRouter = router({
  places: placesRouter,
  auth: authRouter,
  profile: profileRouter,
  missions: missionsRouter,
})

export type ApiRouter = typeof apiRouter
