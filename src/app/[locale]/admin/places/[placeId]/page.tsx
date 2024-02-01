import type { Metadata } from 'next'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { LocaleParams, onlyTranslatableLocales } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { PlaceForm } from '../__components/place-form'

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'admin')
  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
    description: t('meta.description'),
  }
}

type Params = LocaleParams & { placeId: string }

const AdminEditPlacePage: FC<{
  params: Params
}> = async ({ params }) => {
  const trpc = await getTrpc()
  const place = await trpc.admin.places.get({
    id: Number(params.placeId),
    locale: onlyTranslatableLocales(params.locale),
  })

  return (
    <>
      <main className="mx-auto min-h-screen max-w-7xl p-4 sm:py-8 lg:py-12">
        <PlaceForm place={place} />
      </main>
    </>
  )
}

export default AdminEditPlacePage
