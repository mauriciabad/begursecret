import { getServerSession } from 'next-auth'
import { NextIntlClientProvider, useLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter, Poppins } from 'next/font/google'
import type { FC, PropsWithChildren } from 'react'
import { AuthProvider } from '~/components/providers/auth-provider'
import { NextuiProvider } from '~/components/providers/nextui-provider'
import { TrpcProvider } from '~/components/providers/trpc-provider'
import { cn } from '~/helpers/cn'
import { authOptions } from '~/server/auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const PageLayout: FC<PropsWithChildren> = async ({ children }) => {
  const locale = useLocale()
  const messages = await getMessages(locale)
  const session = await getServerSession(authOptions)

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
        <AuthProvider session={session}>
          <TrpcProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <NextuiProvider>{children}</NextuiProvider>
            </NextIntlClientProvider>
          </TrpcProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
