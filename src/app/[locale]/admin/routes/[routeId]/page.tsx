import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import { LocaleParams, LocaleRouteParams } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { RouteForm } from '../_components/route-form'

export async function generateMetadata({
  params: { locale },
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'admin' })
  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
    description: t('meta.description'),
  }
}

type Params = LocaleParams & { routeId: string }

const AdminEditRoutePage: FC<{
  params: Params
}> = async ({ params }) => {
  const trpc = await getTrpc()
  const route = await trpc.admin.routes.get({
    id: Number(params.routeId),
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
