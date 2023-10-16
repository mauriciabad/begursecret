'use client'

import { Button } from '@nextui-org/react'
import Link from 'next-intl/link'
import { FC, ReactNode } from 'react'

export const LinkIconButton: FC<{
  url: string
  label: string
  children: ReactNode
}> = ({ url, label, children }) => {
  return (
    <Button as={Link} href={url} variant="light" aria-label={label} isIconOnly>
      {children}
    </Button>
  )
}
