import 'server-only'

import { sql } from 'drizzle-orm'
import { db } from '~/server/db/db'

export async function getVisitedPlaceListIdByUserId(userId: string) {
  const result = await getVisitedPlaceListId.execute({
    userId,
  })
  if (!result) throw new Error('User has no visited place list')

  return result.visitedPlaceListId
}

const getVisitedPlaceListId = db.query.users
  .findFirst({
    columns: {
      visitedPlaceListId: true,
    },
    where: (users, { eq }) => eq(users.id, sql.placeholder('userId')),
  })
  .prepare('helpers/placeLists/getVisitedPlaceListId')

const getPlacesInList = db.query.placeListToPlace
  .findMany({
    columns: {
      placeId: true,
    },
    where: (placeListToPlace, { eq }) =>
      eq(placeListToPlace.placeListId, sql.placeholder('placeListId')),
  })
  .prepare('helpers/placeLists/getPlacesInList')

export async function getVisitedPlacesIdsByUserId(userId?: string) {
  if (!userId) return new Set<number>()

  const visitedPlaceListId = await getVisitedPlaceListIdByUserId(userId)

  const result = await getPlacesInList.execute({
    placeListId: visitedPlaceListId,
  })
  return new Set(result.map((place) => place.placeId))
}
