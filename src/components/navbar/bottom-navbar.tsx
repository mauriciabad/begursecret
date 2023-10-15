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

export const BottomNavbar = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white shadow-xl">
      <ul className="grid h-12 grid-cols-4">
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
          icon={<IconUser />}
          iconActive={<IconUserFilled />}
        />
      </ul>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <DbEnvironmentTag />
      </div>
    </nav>
  )
}
