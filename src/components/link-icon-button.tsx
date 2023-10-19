import { LinkButton } from './link-button'
import { FC, ReactNode } from 'react'

export const LinkIconButton: FC<{
  url: string
  label: string
  children: ReactNode
}> = ({ url, label, children }) => {
  return (
    <LinkButton href={url} variant="light" aria-label={label} isIconOnly>
      {children}
    </LinkButton>
  )
}
