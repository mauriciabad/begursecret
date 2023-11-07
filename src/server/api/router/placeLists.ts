import 'server-only'

import { sql } from 'drizzle-orm'
import { addToVisitedPlacesListSchema } from '~/schemas/placeLists'
import { db } from '~/server/db/db'
import { placeListToPlace } from '~/server/db/schema'
import { getVisitedPlaceListIdByUserId } from '~/server/helpers/db-queries/placeLists'
import { protectedProcedure, router } from '~/server/trpc'

const addToPlaceList = db
  .insert(placeListToPlace)
  .values({
    placeListId: sql.placeholder('placeListId'),
    placeId: sql.placeholder('placeId'),
  })
  .prepare()

export const placeListsRouter = router({
  addToVisitedPlacesList: protectedProcedure
    .input(addToVisitedPlacesListSchema)
    .mutation(async ({ input, ctx }) => {
      const visitedPlaceListId = await getVisitedPlaceListIdByUserId(
        ctx.session.user.id
      )

      return await addToPlaceList.execute({
        placeListId: visitedPlaceListId,
        placeId: input.placeId,
      })
    }),
})
