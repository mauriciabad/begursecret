import { IconEdit } from '@tabler/icons-react'
import type { Metadata } from 'next'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { LocaleParams } from '~/i18n'

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
  return (
    <>
      <main className="mx-auto min-h-screen max-w-7xl p-4 sm:py-8 lg:py-12">
        <IconEdit
          className="mx-auto mb-4 h-24 w-24 text-brand-600"
          stroke={1}
        />

        <h1 className="text-center font-title text-4xl font-bold uppercase text-stone-800">
          Edit place #{params.placeId}
        </h1>
      </main>
    </>
  )
}

export default AdminEditPlacePage
