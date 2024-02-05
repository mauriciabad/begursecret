'use client'

import { FC, ReactNode } from 'react'
import { usePathname } from '~/navigation'
import { LinkButton } from '../links/link-button'

export const BottomNavbarItem: FC<{
  url: string
  icon: ReactNode
  iconActive?: ReactNode
  label: string
}> = ({ url, icon, iconActive, label }) => {
  const pathname = usePathname()

  const isActive = pathname.startsWith(url)

  return (
    <li>
      <LinkButton
        href={url}
        className="flex h-full items-center justify-center"
        aria-label={label}
        variant="light"
        radius="none"
      >
        {!!iconActive && isActive ? iconActive : icon}
      </LinkButton>
    </li>
  )
}
