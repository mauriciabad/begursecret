import 'server-only'

import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { numericIdSchema } from '~/schemas/shared'
import { db } from '~/server/db/db'
import { adminProcedure, router } from '~/server/trpc'

const getByIdSchema = z.object({
  id: numericIdSchema.nullable().optional(),
})

const getAllImages = db.query.images.findMany().prepare('images/getAll')
const getById = db.query.images
  .findFirst({
    where: (image, { eq }) =>
      eq(image.id, sql`${sql.placeholder('id')}::integer`),
  })
  .prepare('images/getById')

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
