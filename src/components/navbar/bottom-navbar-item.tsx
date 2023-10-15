'use client'

import { usePathname } from 'next-intl/client'
import Link from 'next-intl/link'
import { FC, ReactNode } from 'react'

export const BottomNavbarItem: FC<{
  url: string
  icon: ReactNode
  iconActive?: ReactNode
}> = ({ url, icon, iconActive }) => {
  const pathname = usePathname()

  return (
    <li>
      <Link href={url} className="flex h-full items-center justify-center">
        {!!iconActive && pathname === url ? iconActive : icon}
      </Link>
    </li>
  )
}
