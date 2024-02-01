import type { Metadata } from 'next'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { type LocaleRouteParams } from '~/i18n'
import { PlaceForm } from '../__components/place-form'

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

const AdminNewPlacePage: FC<LocaleRouteParams> = async () => {
  return (
    <>
      <main className="mx-auto min-h-screen max-w-7xl p-4 sm:py-8 lg:py-12">
        <PlaceForm />
      </main>
    </>
  )
}

export default AdminNewPlacePage
