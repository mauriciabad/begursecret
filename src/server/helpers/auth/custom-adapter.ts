import 'server-only'

import { and, eq } from 'drizzle-orm'
import type { Adapter } from 'next-auth/adapters'
import { db } from '../../db/db'
import { accounts, sessions, users, verificationTokens } from '../../db/schema'
import { initializeUserInDatabase } from './initialize-user'

// This adapter is a modified version of the default MySQL Drizzle adapter. (@auth/drizzle-adapter)
// https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-drizzle/src/lib/mysql.ts
export const CustomAdapter = {
  createUser: initializeUserInDatabase,

  async getUser(data) {
    const thing =
      (await db
        .select()
        .from(users)
        .where(eq(users.id, data))
        .then((res) => res[0])) ?? null

    return thing
  },
  async getUserByEmail(data) {
    const user =
      (await db
        .select()
        .from(users)
        .where(eq(users.email, data))
        .then((res) => res[0])) ?? null

    return user
  },
  async createSession(data) {
    await db.insert(sessions).values(data)

    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionToken, data.sessionToken))
      .then((res) => res[0])
  },
  async getSessionAndUser(data) {
    const sessionAndUser =
      (await db
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(users, eq(users.id, sessions.userId))
        .then((res) => res[0])) ?? null

    return sessionAndUser
  },
  async updateUser(data) {
    if (!data.id) {
      throw new Error('No user id.')
    }

    await db.update(users).set(data).where(eq(users.id, data.id))

    return await db
      .select()
      .from(users)
      .where(eq(users.id, data.id))
      .then((res) => res[0])
  },
  async updateSession(data) {
    await db
      .update(sessions)
      .set(data)
      .where(eq(sessions.sessionToken, data.sessionToken))

    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionToken, data.sessionToken))
      .then((res) => res[0])
  },
  async linkAccount(rawAccount) {
    await db.insert(accounts).values(rawAccount)
  },
  async getUserByAccount(account) {
    const dbAccount =
      (await db
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        )
        .leftJoin(users, eq(accounts.userId, users.id))
        .then((res) => res[0])) ?? null

    if (!dbAccount) {
      return null
    }

    return dbAccount.user
  },
  async deleteSession(sessionToken) {
    const session =
      (await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .then((res) => res[0])) ?? null

    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken))

    return session
  },
  async createVerificationToken(token) {
    await db.insert(verificationTokens).values(token)

    return await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.identifier, token.identifier))
      .then((res) => res[0])
  },
  async useVerificationToken(token) {
    try {
      const deletedToken =
        (await db
          .select()
          .from(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token)
            )
          )
          .then((res) => res[0])) ?? null

      await db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, token.identifier),
            eq(verificationTokens.token, token.token)
          )
        )

      return deletedToken
    } catch (err) {
      throw new Error('No verification token found.')
    }
  },
  async deleteUser(id) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then((res) => res[0] ?? null)

    await db.delete(users).where(eq(users.id, id))

    return user
  },
  async unlinkAccount(account) {
    await db
      .delete(accounts)
      .where(
        and(
          eq(accounts.providerAccountId, account.providerAccountId),
          eq(accounts.provider, account.provider)
        )
      )

    return undefined
  },
} satisfies Adapter
