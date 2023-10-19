import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { AuthProvider } from '~/components/providers/auth-provider'
import { NextuiProvider } from '~/components/providers/nextui-provider'
import { TrpcProvider } from '~/components/providers/trpc-provider'
import { Session } from 'next-auth'

import messages from '~/messages/en.json'

const LOCALE = 'en'

function makeWrapper({ session = null }: { session?: Session | null }) {
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <AuthProvider session={session}>
        <TrpcProvider>
          <NextIntlClientProvider locale={LOCALE} messages={messages}>
            <NextuiProvider>{children}</NextuiProvider>
          </NextIntlClientProvider>
        </TrpcProvider>
      </AuthProvider>
    )
  }

  return AllProviders
}

export const customRender = (
  ui: ReactElement,
  {
    session,
    ...options
  }: Omit<RenderOptions, 'wrapper'> & { session?: Session | null } = {}
) => render(ui, { wrapper: makeWrapper({ session }), ...options })
