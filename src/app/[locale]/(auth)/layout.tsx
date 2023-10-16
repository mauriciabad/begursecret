import type { FC, PropsWithChildren } from 'react'
import type { LocaleRouteParams } from '~/i18n'

type AuthRootLayoutProps = PropsWithChildren<LocaleRouteParams>

const AuthRootLayout: FC<AuthRootLayoutProps> = async ({ children }) => {
  return <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
}

export default AuthRootLayout
