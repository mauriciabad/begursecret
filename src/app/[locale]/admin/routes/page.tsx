import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import {
  onlyTranslatableLocales,
  parseLocale,
  type LocaleRouteParams,
} from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { RoutesTable } from './_components/routes-table'

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

const AdminPage: FC<LocaleRouteParams> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const trpc = await getTrpc()
  const routes = await trpc.admin.routes.list({
    locale: onlyTranslatableLocales(locale),
  })

  return (
    <>
      <main className="mx-auto min-h-screen max-w-7xl p-4 sm:py-8 lg:py-12">
        <RoutesTable routes={routes} />
      </main>
    </>
  )
}

export default AdminPage
