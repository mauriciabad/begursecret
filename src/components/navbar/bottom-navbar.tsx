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
import { getSession } from '~/server/get-server-thing'
import { cn } from '~/helpers/cn'
import { FC } from 'react'
import { UserAvatar } from '../user-avatar'

export const BottomNavbar: FC<{
  className?: string
}> = async ({ className }) => {
  const session = await getSession()

  return (
    <nav
      className={cn(
        'fixed inset-x-0 bottom-0 h-14 border-t border-stone-200 bg-white shadow-xl',
        className
      )}
    >
      <ul className="mx-auto grid h-full max-w-2xl grid-cols-4">
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
            session ? (
              <UserAvatar
                user={session.user}
                className="box-content h-6 w-6 rounded-full"
              />
            ) : (
              <IconUser />
            )
          }
          iconActive={
            session ? (
              <UserAvatar
                user={session.user}
                className="box-content h-6 w-6 rounded-full border-2 border-current"
              />
            ) : (
              <IconUserFilled />
            )
          }
        />
      </ul>
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <DbEnvironmentTag />
      </div>
    </nav>
  )
}
