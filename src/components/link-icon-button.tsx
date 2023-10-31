import { FC, ReactNode } from 'react'
import { LinkButton } from './link-button'

export const LinkIconButton: FC<{
  href: string
  label: string
  children: ReactNode
  className?: string
  isExternal?: boolean
}> = ({ href: url, label, children, className, isExternal }) => {
  return (
    <LinkButton
      href={url}
      variant="light"
      aria-label={label}
      isIconOnly
      className={className}
      isExternal={isExternal}
    >
      {children}
    </LinkButton>
  )
}
