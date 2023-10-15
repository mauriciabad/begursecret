import type { Metadata } from 'next'
import { getTranslator } from 'next-intl/server'
import type { FC, PropsWithChildren } from 'react'

import '~/globals.css'
import { PageLayout } from '../../../components/layouts/page-layout'
import type { LocaleRouteParams } from '~/i18n'
import { BottomNavbar } from '../../../components/navbar/bottom-navbar'

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

type DefaultRootLayoutProps = PropsWithChildren<LocaleRouteParams>

const DefaultRootLayout: FC<DefaultRootLayoutProps> = ({ children }) => {
  return (
    <PageLayout>
      <main className="mx-auto max-w-2xl px-4">{children}</main>
      <BottomNavbar />
    </PageLayout>
  )
}

export default DefaultRootLayout
