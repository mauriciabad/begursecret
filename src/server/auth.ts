import 'server-only'

import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { type AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { env } from '~/env.mjs'
import { loginSchema } from '~/schemas/auth'
import { updateSessionSchema } from '~/schemas/profile'
import { db } from './db/db'
import { users } from './db/schema'
import { CustomAdapter } from './helpers/auth/custom-adapter'

export const authOptions: AuthOptions = {
  adapter: CustomAdapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials)
        if (!parsedCredentials.success) throw new Error('invalidInput')
        const input = parsedCredentials.data

        const user = await db.query.users.findFirst({
          where: eq(users.email, input.email),
        })
        if (!user) throw new Error('userDoesNotExist')
        if (!user.hashedPassword) throw new Error('userDoesNotHavePassword')

        const isCorrectPassword = await bcrypt.compare(
          input.password,
          user.hashedPassword
        )
        if (!isCorrectPassword) throw new Error('incorrectPassword')

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/profile',
    newUser: '/complete-profile',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (trigger === 'update') {
        const validatedSession = updateSessionSchema.parse(session)
        return { ...token, ...validatedSession }
      }
      if (trigger === 'signIn' || trigger === 'signUp') {
        const role =
          user.role ??
          (
            await db.query.users.findFirst({
              where: eq(users.id, user.id),
              columns: { role: true },
            })
          )?.role

        return { ...token, id: user.id, role }
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        role: token.role,
      }
      return session
    },
  },
}
