import 'server-only'

import { desc } from 'drizzle-orm'
import { db } from '~/server/db/db'
import { places } from '~/server/db/schema/places'
import { procedure, router } from '~/server/trpc'

export const placesRouter = router({
  list: procedure.query(async () => {
    return await db.query.places.findMany({
      orderBy: [desc(places.name)],
    })
  }),
})
