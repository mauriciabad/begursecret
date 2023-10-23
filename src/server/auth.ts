import 'server-only'

import { DrizzleAdapter } from '@auth/drizzle-adapter'
import type { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { env } from '~/env.mjs'
import { db } from './db/db'
import bcrypt from 'bcryptjs'
import { loginSchema } from '~/schemas/auth'
import { eq } from 'drizzle-orm'
import { users } from './db/schema'
import { updateSessionSchema } from '~/schemas/profile'

export const authOptions: AuthOptions = {
  // Note: Cast required to workaround issue https://github.com/nextauthjs/next-auth/issues/8283
  adapter: DrizzleAdapter(db) as AuthOptions['adapter'],
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
        return { ...token, id: user.id }
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
      }
      return session
    },
  },
}
