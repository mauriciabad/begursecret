'use client'

import { NextUIProvider, NextUIProviderProps } from '@nextui-org/react'
import type { FC, PropsWithChildren } from 'react'
import { useRouter } from '~/navigation'

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
