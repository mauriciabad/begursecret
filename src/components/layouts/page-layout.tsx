import { NextIntlClientProvider, useLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter, Poppins } from 'next/font/google'
import Script from 'next/script'
import type { FC, PropsWithChildren } from 'react'
import { AuthProvider } from '~/components/providers/auth-provider'
import { NextuiProvider } from '~/components/providers/nextui-provider'
import { TrpcProvider } from '~/components/providers/trpc-provider'
import { env } from '~/env.mjs'
import { cn } from '~/helpers/cn'
import { auth } from '~/server/auth'
import { AxiomWebVitals } from 'next-axiom'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const PageLayout: FC<PropsWithChildren> = async ({ children }) => {
  const locale = useLocale()
  const messages = await getMessages(locale)
  const session = await auth()

  return (
    <html lang={locale}>
      <body
        className={cn([
          inter.className,
          poppins.variable,
          inter.variable,
          'min-h-screen bg-stone-50',
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
