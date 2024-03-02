import { sql } from 'drizzle-orm'
import 'server-only'
import { z } from 'zod'
import { numericIdSchema } from '~/schemas/shared'

import { db } from '~/server/db/db'
import { adminProcedure, router } from '~/server/trpc'

const getByIdSchema = z.object({
  id: numericIdSchema.nullable().optional(),
})

const getAllImages = db.query.images.findMany().prepare()
const getById = db.query.images
  .findFirst({
    where: (image, { eq }) => eq(image.id, sql.placeholder('id')),
  })
  .prepare()

export const imagesAdminRouter = router({
  getAll: adminProcedure.query(async () => {
    return await getAllImages.execute()
  }),
  getById: adminProcedure.input(getByIdSchema).query(async ({ input }) => {
    return await getById.execute({
      id: input.id,
    })
  }),
})
