import type { Metadata } from 'next'
import { getTranslator } from 'next-intl/server'
import type { FC, PropsWithChildren } from 'react'

import '~/globals.css'
import { PageLayout } from '../../../components/layouts/page-layout'
import type { LocaleRouteParams } from '~/i18n'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'home')
  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
  }
}

type AuthRootLayoutProps = PropsWithChildren<LocaleRouteParams>

const AuthRootLayout: FC<AuthRootLayoutProps> = async ({ children }) => {
  return (
    <PageLayout>
      <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
    </PageLayout>
  )
}

export default AuthRootLayout
