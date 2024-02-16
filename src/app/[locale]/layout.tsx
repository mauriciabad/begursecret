import '~/globals.css'

import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { AxiomWebVitals } from 'next-axiom'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { Inter, Poppins } from 'next/font/google'
import Script from 'next/script'
import type { FC, PropsWithChildren } from 'react'
import { AuthProvider } from '~/components/providers/auth-provider'
import { NextuiProvider } from '~/components/providers/nextui-provider'
import { TrpcProvider } from '~/components/providers/trpc-provider'
import { env } from '~/env.mjs'
import { cn } from '~/helpers/cn'
import { type LocaleRouteParams } from '~/i18n'
import { PlaceCategoryColor } from '~/server/db/constants/places'
import { getSession } from '~/server/get-server-thing'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const viewport: Viewport = {
  themeColor: '#5F797A',
}

export async function generateMetadata({
  params: { locale },
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' })

  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
    description: t('meta.description'),
    icons: {
      apple: '/favicon/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: t('meta.title'),
      // startUpImage: [],
    },
    applicationName: t('meta.title'),
  }
}

type RootLayoutProps = PropsWithChildren<LocaleRouteParams>

const RootLayout: FC<RootLayoutProps> = async ({
  children,
  params: { locale },
}) => {
  const messages = await getMessages({ locale })
  const session = await getSession()

  return (
    <html lang={locale}>
      <body
        className={cn([
          inter.className,
          poppins.variable,
          inter.variable,
          'bg-stone-50',
        ])}
      >
        <AxiomWebVitals />

        <AuthProvider session={session}>
          <TrpcProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <NextuiProvider>{children}</NextuiProvider>
            </NextIntlClientProvider>
          </TrpcProvider>
        </AuthProvider>

        {env.VERCEL_ENV === 'production' && (
          <Script
            async
            src="https://analytics.eu.umami.is/script.js"
            data-website-id="05dcd962-e08b-4cff-82a6-b0a62c4177a3"
          />
        )}
        <SpeedInsights />
      </body>
    </html>
  )
}
export default RootLayout

// Force Tailwind to load this classes
export const colorClasses = {
  border: {
    gray: 'border-gray-800',
    red: 'border-red-800',
    orange: 'border-orange-800',
    amber: 'border-amber-800',
    yellow: 'border-yellow-800',
    lime: 'border-lime-800',
    green: 'border-green-800',
    emerald: 'border-emerald-800',
    teal: 'border-teal-800',
    cyan: 'border-cyan-800',
    sky: 'border-sky-800',
    blue: 'border-blue-800',
    indigo: 'border-indigo-800',
    violet: 'border-violet-800',
    purple: 'border-purple-800',
    fuchsia: 'border-fuchsia-800',
    pink: 'border-pink-800',
    rose: 'border-rose-800',
  },
  bg: {
    gray: 'bg-gray-700',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    amber: 'bg-amber-500',
    yellow: 'bg-yellow-500',
    lime: 'bg-lime-500',
    green: 'bg-green-500',
    emerald: 'bg-emerald-500',
    teal: 'bg-teal-500',
    cyan: 'bg-cyan-500',
    sky: 'bg-sky-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    violet: 'bg-violet-500',
    purple: 'bg-purple-500',
    fuchsia: 'bg-fuchsia-500',
    pink: 'bg-pink-500',
    rose: 'bg-rose-500',
  },
  beforeBg: {
    gray: 'before:bg-gray-700',
    red: 'before:bg-red-500',
    orange: 'before:bg-orange-500',
    amber: 'before:bg-amber-500',
    yellow: 'before:bg-yellow-500',
    lime: 'before:bg-lime-500',
    green: 'before:bg-green-500',
    emerald: 'before:bg-emerald-500',
    teal: 'before:bg-teal-500',
    cyan: 'before:bg-cyan-500',
    sky: 'before:bg-sky-500',
    blue: 'before:bg-blue-500',
    indigo: 'before:bg-indigo-500',
    violet: 'before:bg-violet-500',
    purple: 'before:bg-purple-500',
    fuchsia: 'before:bg-fuchsia-500',
    pink: 'before:bg-pink-500',
    rose: 'before:bg-rose-500',
  },
  stroke: {
    gray: 'stroke-gray-700',
    red: 'stroke-red-500',
    orange: 'stroke-orange-500',
    amber: 'stroke-amber-500',
    yellow: 'stroke-yellow-500',
    lime: 'stroke-lime-500',
    green: 'stroke-green-500',
    emerald: 'stroke-emerald-500',
    teal: 'stroke-teal-500',
    cyan: 'stroke-cyan-500',
    sky: 'stroke-sky-500',
    blue: 'stroke-blue-500',
    indigo: 'stroke-indigo-500',
    violet: 'stroke-violet-500',
    purple: 'stroke-purple-500',
    fuchsia: 'stroke-fuchsia-500',
    pink: 'stroke-pink-500',
    rose: 'stroke-rose-500',
  },
  stroke20: {
    gray: 'stroke-gray-500/20',
    red: 'stroke-red-500/20',
    orange: 'stroke-orange-500/20',
    amber: 'stroke-amber-500/20',
    yellow: 'stroke-yellow-500/20',
    lime: 'stroke-lime-500/20',
    green: 'stroke-green-500/20',
    emerald: 'stroke-emerald-500/20',
    teal: 'stroke-teal-500/20',
    cyan: 'stroke-cyan-500/20',
    sky: 'stroke-sky-500/20',
    blue: 'stroke-blue-500/20',
    indigo: 'stroke-indigo-500/20',
    violet: 'stroke-violet-500/20',
    purple: 'stroke-purple-500/20',
    fuchsia: 'stroke-fuchsia-500/20',
    pink: 'stroke-pink-500/20',
    rose: 'stroke-rose-500/20',
  },

  text: {
    gray: 'text-gray-700',
    red: 'text-red-500',
    orange: 'text-orange-500',
    amber: 'text-amber-500',
    yellow: 'text-yellow-500',
    lime: 'text-lime-500',
    green: 'text-green-500',
    emerald: 'text-emerald-500',
    teal: 'text-teal-500',
    cyan: 'text-cyan-500',
    sky: 'text-sky-500',
    blue: 'text-blue-500',
    indigo: 'text-indigo-500',
    violet: 'text-violet-500',
    purple: 'text-purple-500',
    fuchsia: 'text-fuchsia-500',
    pink: 'text-pink-500',
    rose: 'text-rose-500',
  },
} as const satisfies {
  [x: string]: Record<PlaceCategoryColor, string>
}
