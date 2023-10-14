import { getServerSession } from 'next-auth'
import { NextIntlClientProvider, useLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import type { FC, PropsWithChildren, ReactNode } from 'react'

import { authOptions } from '~/server/auth'
import { AuthProvider } from '~/components/providers/auth-provider'
import { TrpcProvider } from '~/components/providers/trpc-provider'
import { NextuiProvider } from '~/components/providers/nextui-provider'
import { BottomNavbar } from './bottom-navbar'

type PageLayoutProps = PropsWithChildren<{ header?: ReactNode }>

export const PageLayout: FC<PageLayoutProps> = async ({ children, header }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const locale = useLocale()
  const messages = await getMessages(locale)
  const session = await getServerSession(authOptions)

  return (
    <html lang={locale}>
      <body>
        <AuthProvider session={session}>
          <TrpcProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <NextuiProvider>
                {header}
                {children}
                <BottomNavbar />
              </NextuiProvider>
            </NextIntlClientProvider>
          </TrpcProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
