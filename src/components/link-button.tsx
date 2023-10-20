'use client'

import { Button, ButtonProps } from '@nextui-org/react'
import Link from 'next-intl/link'
import { FC, ReactNode } from 'react'

export const LinkButton: FC<
  ButtonProps & {
    href: string
    children: ReactNode
  }
> = ({ href, children, ...props }) => {
  return (
    <Button as={Link} href={href} {...props} role="link">
      {children}
    </Button>
  )
}
