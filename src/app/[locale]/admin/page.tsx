import { IconLockOpen } from '@tabler/icons-react'
import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import type { LocaleRouteParams } from '~/i18n'

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
  const t = useTranslations('admin')

  return (
    <>
      <main className="mx-auto min-h-screen max-w-2xl">
        <IconLockOpen className="mx-auto h-24 w-24 text-brand-600" stroke={1} />

        <h1 className="text-center font-title text-4xl font-bold uppercase text-stone-800">
          {t('heading')}
        </h1>

        <p className="mt-4 text-center text-xl">{t('subtitle')}</p>
      </main>
    </>
  )
}

export default AdminPage
