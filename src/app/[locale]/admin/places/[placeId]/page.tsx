import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import { LocaleRouteParams, parseLocale } from '~/i18n'
import { redirect } from '~/navigation'
import { getTrpc } from '~/server/get-server-thing'
import { PlaceForm } from '../_components/place-form'

type PageParams = LocaleRouteParams<{
  placeId: string
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

const AdminEditPlacePage: FC<PageParams> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const placeId = Number(params.placeId)
  const trpc = await getTrpc()
  const place = await trpc.admin.places.get({
    id: placeId,
    locale: null,
  })

  if (!place) redirect('/admin/places/new')

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-4 sm:py-8 lg:py-12">
      <PlaceForm place={place} />
    </main>
  )
}

export default AdminEditPlacePage
