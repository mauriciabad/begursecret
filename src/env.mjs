/* eslint-env node */
// @ts-check
import { z } from 'zod'

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const server = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  BASE_URL: z.string().regex(/https?:\/\/\w+(\.\w+)*(:\d{4})?/),
  NEXTAUTH_URL: z.string().regex(/https?:\/\/\w+(\.\w+)*(:\d{4})?/),
  VERCEL_URL: z
    .string()
    .regex(/[\w\d-]+(\.[\w\d-]+)*/)
    .optional(),

  USE_LOCAL_DB: z.union([z.literal('true'), z.literal('false')]).optional(),
  DATABASE_HOST: z.string().min(1),
  DATABASE_USERNAME: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
})

/**
 * @template {typeof server} T
 * @param {T} obj
 * */
const refineServer = (obj) => obj
// .superRefine((data, ctx) => {
//   if (!data.BASE_URL && !data.VERCEL_URL) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       path: ['BASE_URL'],
//       message: 'BASE_URL is required when there is no VERCEL_URL',
//     })
//   }
// })

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({})

const VERCEL_URL_WITH_PROTOCOL =
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`

const FAKE_VALUE_ONLY_FOR_DEVELOPMENT =
  process.env.NODE_ENV === 'production'
    ? undefined
    : 'fake-value-only-for-development'

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  NODE_ENV: process.env.NODE_ENV,

  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID ?? FAKE_VALUE_ONLY_FOR_DEVELOPMENT,
  GOOGLE_CLIENT_SECRET:
    process.env.GOOGLE_CLIENT_SECRET ?? FAKE_VALUE_ONLY_FOR_DEVELOPMENT,

  BASE_URL: process.env.BASE_URL ?? VERCEL_URL_WITH_PROTOCOL,
  VERCEL_URL: process.env.VERCEL_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? VERCEL_URL_WITH_PROTOCOL,

  USE_LOCAL_DB: process.env.USE_LOCAL_DB,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,

  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
}

// Don't touch the part below
// --------------------------

const merged = refineServer(server.merge(client))

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

/** @type {z.infer<typeof merged>} */
let env = /** @type {any} */ (process.env)

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === 'undefined'

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  )

  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    )
    throw new Error('Invalid environment variables')
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line no-undef
  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith('NEXT_PUBLIC_'))
        throw new Error(
          process.env.NODE_ENV === 'production'
            ? '❌ Attempted to access a server-side environment variable on the client'
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`
        )
      return target[/** @type {keyof typeof target} */ (prop)]
    },
  })
}

export { env }
