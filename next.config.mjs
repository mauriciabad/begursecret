import withPWAInit from '@ducanh2912/next-pwa'
import { withAxiom } from 'next-axiom'
import nextIntlPlugin from 'next-intl/plugin'

/**
 * Run `build` or `dev` script with `SKIP_ENV_VALIDATION` to skip validation
 * of environment variables. This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'))

/**
 * Create config wrapper required for using next-intl with RSCs.
 * See https://next-intl-docs.vercel.app/docs/getting-started/app-router-server-components
 */
const withNextIntl = nextIntlPlugin('./src/server/i18n.ts')

const withPWA = withPWAInit({
  dest: 'public',
  fallbacks: {
    image: '/public/fallback.png',
  },
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = withAxiom(
  withNextIntl(
    withPWA({
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: `${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME ?? '*'}.s3.${process.env.NEXT_PUBLIC_AWS_BUCKET_REGION ?? '*'}.amazonaws.com`,
          },
        ],
      },
    })
  )
)

export default nextConfig
