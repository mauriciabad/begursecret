import { unstable_setRequestLocale } from 'next-intl/server'
import type { FC, PropsWithChildren } from 'react'
import { BottomNavbar } from '~/components/navbar/bottom-navbar'
import { parseLocale, type LocaleRouteParams } from '~/i18n'

type AppLayoutProps = PropsWithChildren<LocaleRouteParams>

const AppLayout: FC<AppLayoutProps> = ({ params, children }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  return (
    <div className="flex min-h-screen grow flex-col pb-14">
      {children}
      <BottomNavbar className="h-14" />
    </div>
  )
}

export default AppLayout
