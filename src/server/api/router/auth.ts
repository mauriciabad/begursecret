import 'server-only'

import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { registerSchema } from '~/schemas/auth'
import { db } from '~/server/db/db'
import { placeLists } from '~/server/db/schema'
import { users } from '~/server/db/schema/users'
import { procedure, router } from '~/server/trpc'

export const authRouter = router({
  register: procedure.input(registerSchema).mutation(async ({ input }) => {
    await initializeUserInDatabase({
      email: input.email,
      password: input.password,
    })
  }),
})

export async function initializeUserInDatabase(
  newUser:
    | { id?: undefined; email: string; password: string }
    | { id: string; email?: undefined; password?: undefined }
) {
  await db.transaction(async (tx) => {
    if (newUser.id === undefined) {
      const existingUser = await tx.query.users.findFirst({
        where: eq(users.email, newUser.email),
      })
      if (existingUser) {
        throw new Error('User already exists')
      }
    } else {
      const existingUser = await tx.query.users.findFirst({
        where: eq(users.id, newUser.id),
      })
      if (!existingUser) {
        throw new Error('User does not exist')
      }

      if (existingUser.visitedPlaceListId) {
        throw new Error('visitedPlaceList already exists')
      }
    }

    const userId = newUser.id ?? uuidv4()

    const visitedPlaceListId = Number(
      (
        await tx.insert(placeLists).values({
          userId,
        })
      ).insertId
    )

    if (
      !(
        await tx.query.placeLists.findFirst({
          columns: { id: true },
          where: eq(placeLists.id, visitedPlaceListId),
        })
      )?.id
    ) {
      throw new Error('Error creating visitedPlaceList')
    }

    if (newUser.id === undefined) {
      await tx.insert(users).values({
        id: userId,
        email: newUser.email,
        hashedPassword: bcrypt.hashSync(newUser.password, 10),
        visitedPlaceListId: visitedPlaceListId,
      })
    } else {
      await tx
        .update(users)
        .set({
          visitedPlaceListId: visitedPlaceListId,
        })
        .where(eq(users.id, userId))
    }
  })
}
