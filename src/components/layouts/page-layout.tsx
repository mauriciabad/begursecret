import { getServerSession } from 'next-auth'
import { NextIntlClientProvider, useLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import type { FC, PropsWithChildren } from 'react'

import { authOptions } from '~/server/auth'
import { AuthProvider } from '~/components/providers/auth-provider'
import { TrpcProvider } from '~/components/providers/trpc-provider'
import { NextuiProvider } from '~/components/providers/nextui-provider'

export const PageLayout: FC<PropsWithChildren> = async ({ children }) => {
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
              <NextuiProvider>{children}</NextuiProvider>
            </NextIntlClientProvider>
          </TrpcProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
