import '~/globals.css'

import type { Metadata } from 'next'
import { getTranslator } from 'next-intl/server'
import type { FC, PropsWithChildren } from 'react'
import { PageLayout } from '~/components/layouts/page-layout'
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
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#5F797A' },
      { media: '(prefers-color-scheme: dark)', color: '#222222' },
    ],
    icons: {
      apple: '/favicon/apple-icon.png',
    },
  }
}

type RootLayoutProps = PropsWithChildren<LocaleRouteParams>

const RootLayout: FC<RootLayoutProps> = async ({ children }) => {
  return <PageLayout>{children}</PageLayout>
}

export default RootLayout
