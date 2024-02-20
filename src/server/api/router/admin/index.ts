import { router } from '~/server/trpc'
import { imagesAdminRouter } from './images'
import { placesAdminRouter } from './places'
import { routesAdminRouter } from './routes'

export const adminRouter = router({
  places: placesAdminRouter,
  routes: routesAdminRouter,
  images: imagesAdminRouter,
})
