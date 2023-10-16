import {
  IconAward,
  IconAwardFilled,
  IconCompass,
  IconCompassFilled,
  IconGift,
  IconGiftFilled,
  IconUser,
  IconUserFilled,
} from '@tabler/icons-react'
import { DbEnvironmentTag } from '../db-environment-tag'
import { BottomNavbarItem } from './bottom-navbar-item'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '~/server/auth'

export const BottomNavbar = async () => {
  const session = await getServerSession(authOptions)

  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white shadow-xl">
      <ul className="mx-auto grid h-12 max-w-2xl grid-cols-4">
        <BottomNavbarItem
          url="/explore"
          icon={<IconCompass />}
          iconActive={<IconCompassFilled />}
        />
        <BottomNavbarItem
          url="/missions"
          icon={<IconAward />}
          iconActive={<IconAwardFilled />}
        />
        <BottomNavbarItem
          url="/hub"
          icon={<IconGift />}
          iconActive={<IconGiftFilled />}
        />
        <BottomNavbarItem
          url="/profile"
          icon={
            session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt=""
                className="box-content h-6 w-6 rounded-full border-2 border-transparent"
              />
            ) : (
              <IconUser />
            )
          }
          iconActive={
            session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt=""
                className="box-content h-6 w-6 rounded-full border-2 border-current"
              />
            ) : (
              <IconUserFilled />
            )
          }
        />
      </ul>
      <div className="-z-1 pointer-events-none absolute inset-0 flex items-center justify-center">
        <DbEnvironmentTag />
      </div>
    </nav>
  )
}
