// @ts-check
import withPWAInit from '@ducanh2912/next-pwa'
import { withAxiom } from 'next-axiom'
import createNextIntlPlugin from 'next-intl/plugin'

/**
 * Run `build` or `dev` script with `SKIP_ENV_VALIDATION` to skip validation
 * of environment variables. This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'))

/** @type {import('next').NextConfig} */
const nextBaseConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME ?? '*'}.s3.${
          process.env.NEXT_PUBLIC_AWS_BUCKET_REGION ?? '*'
        }.amazonaws.com`,
      },
      {
        protocol: 'https',
        hostname: 'begursecret.com',
      },
      {
        protocol: 'https',
        hostname: 'begursecret-mauriciabad.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'begursecret-*-mauriciabad.vercel.app',
      },
    ],
    unoptimized: process.env.VERCEL_ENV !== 'production',
    // Content images in S3 are stored under unique keys (contents/<uuid>.<ext>)
    // and never change, so cache optimized versions for 31 days instead of the
    // 1h default (S3 objects have no Cache-Control). Cuts cache writes and
    // transformations. See https://vercel.com/docs/image-optimization/managing-image-optimization-costs
    minimumCacheTTL: 2678400,
    // Content is at most max-w-2xl (672px) wide, so drop the 2048/3840 widths.
    deviceSizes: [640, 828, 1080, 1200, 1920],
  },
}

/**
 * Create config wrapper required for using next-intl with RSCs.
 * See https://next-intl-docs.vercel.app/docs/getting-started/app-router-server-components
 */
const withNextIntl = createNextIntlPlugin('./src/server/i18n.ts')

const withPWA = withPWAInit({
  dest: 'public',
  fallbacks: {
    image: '/fallback.png',
  },
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = withAxiom(withNextIntl(withPWA(nextBaseConfig)))

export default nextConfig
