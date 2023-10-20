import { LinkButton } from './link-button'
import { FC, ReactNode } from 'react'

export const LinkIconButton: FC<{
  href: string
  label: string
  children: ReactNode
}> = ({ href: url, label, children }) => {
  return (
    <LinkButton href={url} variant="light" aria-label={label} isIconOnly>
      {children}
    </LinkButton>
  )
}
