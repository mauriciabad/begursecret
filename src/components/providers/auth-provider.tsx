'use client'

import { SessionProvider, SessionProviderProps } from 'next-auth/react'
import type { FC } from 'react'

export const AuthProvider: FC<SessionProviderProps> = ({
  children,
  ...props
}) => {
  return <SessionProvider {...props}>{children}</SessionProvider>
}
