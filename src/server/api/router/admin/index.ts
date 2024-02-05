import { router } from '~/server/trpc'
import { imagesAdminRouter } from './images'
import { placesAdminRouter } from './places'

export const adminRouter = router({
  places: placesAdminRouter,
  images: imagesAdminRouter,
})
