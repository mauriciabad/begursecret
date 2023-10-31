'use client'

import { usePathname } from 'next-intl/client'
import Link from 'next-intl/link'
import { FC, ReactNode } from 'react'

export const BottomNavbarItem: FC<{
  url: string
  icon: ReactNode
  iconActive?: ReactNode
  label: string
}> = ({ url, icon, iconActive, label }) => {
  const pathname = usePathname()

  return (
    <li>
      <Link
        href={url}
        className="flex h-full items-center justify-center"
        aria-label={label}
      >
        {!!iconActive && pathname.startsWith(url) ? iconActive : icon}
      </Link>
    </li>
  )
}
