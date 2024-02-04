'use client'

import { Button, ButtonProps } from '@nextui-org/button'
import { FC, ReactNode } from 'react'
import { Link } from '~/navigation'

export const LinkButton: FC<
  ButtonProps & {
    href: string
    children: ReactNode
    isExternal?: boolean
  }
> = ({ href, children, isExternal, ...props }) => {
  return (
    <Button
      as={Link}
      href={href}
      {...props}
      role="link"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
    </Button>
  )
}
