import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import { type LocaleRouteParams } from '~/i18n'
import { WipRoutes } from './_components/wip-routes'

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

const AdminPage: FC<LocaleRouteParams> = async () => {
  return (
    <>
      <main className="mx-auto min-h-screen max-w-7xl p-4 sm:py-8 lg:py-12">
        <h1 className="text-center font-title text-4xl font-bold uppercase text-stone-800">
          Routes WIP page
        </h1>

        <WipRoutes />
      </main>
    </>
  )
}

export default AdminPage
