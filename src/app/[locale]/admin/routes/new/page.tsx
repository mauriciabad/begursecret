import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import { parseLocale, type LocaleRouteParams } from '~/i18n'
import { RouteForm } from '../_components/route-form'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'admin' })
  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
    description: t('meta.description'),
  }
}

const AdminNewRoutePage: FC<LocaleRouteParams> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  return (
    <>
      <main className="mx-auto min-h-screen max-w-7xl p-4 sm:py-8 lg:py-12">
        <RouteForm />
      </main>
    </>
  )
}

export default AdminNewRoutePage
