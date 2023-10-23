import 'server-only'

import { registerSchema } from '~/schemas/auth'
import bcrypt from 'bcryptjs'
import { db } from '~/server/db/db'
import { users } from '~/server/db/schema/users'
import { procedure, router } from '~/server/trpc'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export const authRouter = router({
  register: procedure.input(registerSchema).mutation(async ({ input }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    })

    if (existingUser) {
      throw new Error('User already exists')
    }

    return await db.insert(users).values({
      id: uuidv4(),
      email: input.email,
      hashedPassword: bcrypt.hashSync(input.password, 10),
    })
  }),
})
