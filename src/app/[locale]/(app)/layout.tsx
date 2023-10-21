import type { FC, PropsWithChildren } from 'react'
import { BottomNavbar } from '~/components/navbar/bottom-navbar'
import type { LocaleRouteParams } from '~/i18n'

type ProfileLayoutProps = PropsWithChildren<LocaleRouteParams>

const ProfileLayout: FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <div className="pb-14">
      {children}
      <BottomNavbar className="h-14" />
    </div>
  )
}

export default ProfileLayout
