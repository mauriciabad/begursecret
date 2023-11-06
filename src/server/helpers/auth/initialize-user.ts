import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { db } from '~/server/db/db'
import { placeLists } from '~/server/db/schema'
import { users } from '~/server/db/schema/users'

export async function initializeUserInDatabase(newUser: {
  email: string
  password?: string
  emailVerified?: Date | null
  name?: string | null
  image?: string | null
}) {
  return await db.transaction(async (tx) => {
    if (newUser.password) {
      const existingUser = await tx.query.users.findFirst({
        where: eq(users.email, newUser.email),
      })
      if (existingUser) {
        throw new Error('User already exists with that email')
      }
    }

    const userId = uuidv4()

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

    await tx.insert(users).values({
      id: userId,
      email: newUser.email,
      emailVerified: newUser.emailVerified,
      name: newUser.name,
      image: newUser.image,
      hashedPassword: newUser.password
        ? bcrypt.hashSync(newUser.password, 10)
        : null,
      visitedPlaceListId: visitedPlaceListId,
    })

    return await tx
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .then((res) => res[0])
  })
}
