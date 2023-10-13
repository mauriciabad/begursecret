'use client'

import { NextUIProvider } from '@nextui-org/react'
import type { FC, PropsWithChildren } from 'react'

export const NextuiProvider: FC<PropsWithChildren> = ({ children }) => {
  return <NextUIProvider>{children}</NextUIProvider>
}
