import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { withAxiom } from 'next-axiom'
import 'server-only'

import { apiRouter } from '~/server/api/router'
import { createContext } from '~/server/trpc'

/**
 * Public queries that return the same data to every visitor (no session or
 * locale dependency) and can be cached by Vercel's CDN. The map loads these on
 * every visit (~350 KB), so caching them saves a lot of Fast Origin Transfer.
 */
const CDN_CACHEABLE_PATHS = new Set(['map.getAllPlaces', 'map.getAllRoutes'])
const ONE_HOUR = 60 * 60
const ONE_DAY = 24 * ONE_HOUR

const handler = withAxiom((req) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: apiRouter,
    createContext: () => createContext(req),
    responseMeta({ paths, type, errors }) {
      const isCacheable =
        type === 'query' &&
        errors.length === 0 &&
        !!paths?.length &&
        paths.every((path) => CDN_CACHEABLE_PATHS.has(path))

      if (!isCacheable) return {}

      return {
        headers: {
          'cache-control': `public, s-maxage=${ONE_HOUR}, stale-while-revalidate=${ONE_DAY}`,
        },
      }
    },
  })
)

export { handler as GET, handler as POST }
