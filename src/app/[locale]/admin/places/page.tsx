import type { Metadata } from 'next'
import { useLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import { onlyTranslatableLocales, type LocaleRouteParams } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { PlacesTable } from './__components/places-table'

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
  const locale = useLocale()
  const trpc = await getTrpc()
  const places = await trpc.admin.places.list({
    locale: onlyTranslatableLocales(locale),
  })
  const categories = await trpc.admin.places.listCategories({
    locale: onlyTranslatableLocales(locale),
  })

  return (
    <>
      <main className="mx-auto min-h-screen max-w-7xl p-4 sm:py-8 lg:py-12">
        <PlacesTable places={places} categories={categories} />
      </main>
    </>
  )
}

export default AdminPage
