import {
  IconAward,
  IconAwardFilled,
  IconCompass,
  IconCompassFilled,
  IconUser,
  IconUserFilled,
} from '@tabler/icons-react'
import { User } from 'next-auth'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { cn } from '~/helpers/cn'
import { getSession } from '~/server/get-server-thing'
import { UserAvatar } from '../generic/user-avatar'
import { BottomNavbarItem } from './bottom-navbar-item'
import { DbEnvironmentTag } from './db-environment-tag'

export const BottomNavbar: FC<{
  className?: string
}> = async ({ className }) => {
  const session = await getSession()

  return <BottomNavbarInner className={className} user={session?.user} />
}

const BottomNavbarInner: FC<{
  className?: string
  user?: User
}> = ({ className, user }) => {
  const t = useTranslations('navbar')

  return (
    <nav
      className={cn(
        'pb-safe fixed inset-x-0 bottom-0 z-50 box-content h-14 border-t border-stone-200 bg-white shadow-xl',
        className
      )}
    >
      <ul className="mx-auto grid h-full max-w-2xl grid-cols-3">
        <BottomNavbarItem
          url="/explore"
          label={t('explore')}
          icon={<IconCompass />}
          iconActive={<IconCompassFilled />}
        />
        <BottomNavbarItem
          url="/missions"
          label={t('missions')}
          icon={<IconAward />}
          iconActive={<IconAwardFilled />}
        />
        {/* <BottomNavbarItem
          url="/hub"
          label={t('hub')}
          icon={<IconGift />}
          iconActive={<IconGiftFilled />}
        /> */}
        <BottomNavbarItem
          url="/profile"
          label={t('profile')}
          icon={
            user ? (
              <UserAvatar
                user={user}
                className="box-content h-6 w-6 rounded-full"
              />
            ) : (
              <IconUser />
            )
          }
          iconActive={
            user ? (
              <UserAvatar
                user={user}
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
