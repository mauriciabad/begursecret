import { router } from '~/server/trpc'
import { placesAdminRouter } from './places'

export const adminRouter = router({
  places: placesAdminRouter,
})
