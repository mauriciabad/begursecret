'use client'

import { FC, ReactNode } from 'react'
import { LinkButton } from './link-button'

export const LinkButtonCustom: FC<{
  href: string
  children: ReactNode
}> = ({ href, children }) => {
  return (
    <LinkButton
      href={href}
      radius="full"
      variant="solid"
      color="primary"
      className="mt-6 bg-brand-600 px-8 py-3 uppercase text-white"
    >
      {children}
    </LinkButton>
  )
}
