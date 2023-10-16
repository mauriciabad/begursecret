import type { FC, PropsWithChildren } from 'react'
import { BottomNavbar } from '~/components/navbar/bottom-navbar'
import type { LocaleRouteParams } from '~/i18n'

type ProfileLayoutProps = PropsWithChildren<LocaleRouteParams>

const ProfileLayout: FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <>
      {children}

      <BottomNavbar />
    </>
  )
}

export default ProfileLayout
