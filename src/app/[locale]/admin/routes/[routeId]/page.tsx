import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import { LocaleRouteParams, parseLocale } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { RouteForm } from '../_components/route-form'

type PageParams = LocaleRouteParams<{
  routeId: string
}>

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'admin' })
  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
    description: t('meta.description'),
  }
}

const AdminEditRoutePage: FC<PageParams> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const routeId = Number(params.routeId)
  const trpc = await getTrpc()
  const route = await trpc.admin.routes.get({
    id: routeId,
    locale: null,
  })

  return (
    <>
      <main className="mx-auto min-h-screen max-w-7xl p-4 sm:py-8 lg:py-12">
        <RouteForm route={route} />
      </main>
    </>
  )
}

export default AdminEditRoutePage
