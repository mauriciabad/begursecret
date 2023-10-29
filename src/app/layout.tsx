import '~/globals.css'

import type { Metadata } from 'next'
import { AxiomWebVitals } from 'next-axiom'
import { NextIntlClientProvider, useLocale } from 'next-intl'
import { getMessages, getTranslator } from 'next-intl/server'
import { Inter, Poppins } from 'next/font/google'
import Script from 'next/script'
import type { FC, PropsWithChildren } from 'react'
import { AuthProvider } from '~/components/providers/auth-provider'
import { NextuiProvider } from '~/components/providers/nextui-provider'
import { TrpcProvider } from '~/components/providers/trpc-provider'
import { env } from '~/env.mjs'
import { cn } from '~/helpers/cn'
import { type LocaleRouteParams } from '~/i18n'
import { getSession } from '~/server/get-server-thing'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'home')
  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
    description: t('meta.description'),
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#5F797A' },
      { media: '(prefers-color-scheme: dark)', color: '#222222' },
    ],
    icons: {
      apple: '/favicon/apple-touch-icon.png',
    },
  }
}

type RootLayoutProps = PropsWithChildren<LocaleRouteParams>

const RootLayout: FC<RootLayoutProps> = async ({ children }) => {
  const locale = useLocale()
  const messages = await getMessages(locale)
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
      </body>
    </html>
  )
}
export default RootLayout
