'use client'

import { NextUIProvider, NextUIProviderProps } from '@nextui-org/react'
import { useRouter } from 'next-intl/client'
import type { FC, PropsWithChildren } from 'react'

export const NextuiProvider: FC<PropsWithChildren<NextUIProviderProps>> = ({
  children,
  ...props
}) => {
  const router = useRouter()

  return (
    <NextUIProvider navigate={router.push} {...props}>
      {children}
    </NextUIProvider>
  )
}
