import 'server-only'

import { db } from '~/server/db/db'
import { adminProcedure, router } from '~/server/trpc'

const getAllImages = db.query.images.findMany().prepare()

export const imagesAdminRouter = router({
  getAll: adminProcedure.query(async () => {
    return await getAllImages.execute()
  }),
})
