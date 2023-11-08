'use client'

import { usePathname } from 'next-intl/client'
import { FC, ReactNode } from 'react'
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
        isDisabled={isActive}
      >
        {!!iconActive && isActive ? iconActive : icon}
      </LinkButton>
    </li>
  )
}
