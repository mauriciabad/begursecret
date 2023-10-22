import 'server-only'

import { router } from '~/server/trpc'
import { placesRouter } from './places'
import { authRouter } from './auth'

export const apiRouter = router({
  places: placesRouter,
  auth: authRouter,
})

export type ApiRouter = typeof apiRouter
