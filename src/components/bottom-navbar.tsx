import Link from 'next-intl/link'
import { IconCompass, IconAward, IconGift, IconUser } from '@tabler/icons-react'
import { FC, PropsWithChildren } from 'react'
import { DbEnvironmentTag } from './db-environment-tag'

export const BottomNavbar = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white shadow-xl">
      <ul className="grid h-12 grid-cols-4">
        <Item url="/explore">
          <IconCompass />
        </Item>
        <Item url="/missions">
          <IconAward />
        </Item>
        <Item url="/hub">
          <IconGift />
        </Item>
        <Item url="/profile">
          <IconUser />
        </Item>
      </ul>
      <div className="absolute inset-0 flex items-center justify-center">
        <DbEnvironmentTag className="pointer-events-none" />
      </div>
    </nav>
  )
}

const Item: FC<PropsWithChildren<{ url: string }>> = ({ children, url }) => {
  return (
    <li>
      <Link href={url} className="flex h-full items-center justify-center">
        {children}
      </Link>
    </li>
  )
}
