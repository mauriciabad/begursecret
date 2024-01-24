import type { Metadata } from 'next'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import type { LocaleRouteParams } from '~/i18n'
import { PlacesTable } from './_components/places-table/places-table'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'admin')
  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
    description: t('meta.description'),
  }
}

const AdminPage: FC<LocaleRouteParams> = () => {
  return (
    <>
      <main className="mx-auto min-h-screen max-w-2xl p-4 sm:py-12">
        <PlacesTable />
      </main>
    </>
  )
}

export default AdminPage
