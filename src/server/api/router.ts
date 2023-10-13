import 'server-only'

import { router } from '~/server/trpc'
import { placesRouter } from './places/router'

export const apiRouter = router({
  places: placesRouter,
})

export type ApiRouter = typeof apiRouter
