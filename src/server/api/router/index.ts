import 'server-only'

import { router } from '~/server/trpc'
import { placesRouter } from './places'
import { authRouter } from './auth'
import { profileRouter } from './profile'

export const apiRouter = router({
  places: placesRouter,
  auth: authRouter,
  profile: profileRouter,
})

export type ApiRouter = typeof apiRouter
