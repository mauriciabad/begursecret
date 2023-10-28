import type { FC, PropsWithChildren } from 'react'
import { BottomNavbar } from '~/components/navbar/bottom-navbar'
import type { LocaleRouteParams } from '~/i18n'

type AppLayoutProps = PropsWithChildren<LocaleRouteParams>

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen grow flex-col pb-14">
      {children}
      <BottomNavbar className="h-14" />
    </div>
  )
}

export default AppLayout
