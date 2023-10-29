'use client'

import { NextUIProvider, NextUIProviderProps } from '@nextui-org/react'
import type { FC, PropsWithChildren } from 'react'

export const NextuiProvider: FC<PropsWithChildren<NextUIProviderProps>> = ({
  children,
  ...props
}) => {
  return <NextUIProvider {...props}>{children}</NextUIProvider>
}
