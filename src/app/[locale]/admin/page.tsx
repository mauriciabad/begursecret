import { IconLockOpen, IconMapPin, IconRoute } from '@tabler/icons-react'
import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import { LinkCard } from '~/components/generic/link-card'
import { parseLocale, type LocaleRouteParams } from '~/i18n'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'admin' })
  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
    description: t('meta.description'),
  }
}

const AdminPage: FC<LocaleRouteParams> = ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const t = useTranslations('admin')

  return (
    <>
      <main className="mx-auto min-h-screen max-w-7xl p-4 sm:py-8 lg:py-12">
        <IconLockOpen
          className="mx-auto mb-4 h-24 w-24 text-brand-600"
          stroke={1}
        />

        <h1 className="text-center font-title text-4xl font-bold uppercase text-stone-800">
          {t('heading')}
        </h1>

        <p className="mt-4 text-center text-xl">{t('subtitle')}</p>

        <div className="mt-8 flex justify-center gap-4">
          <LinkCard
            icon={<IconMapPin />}
            title={t('places')}
            href="/admin/places"
            className="w-72"
          />
          <LinkCard
            icon={<IconRoute />}
            title={t('routes')}
            href="/admin/routes"
            className="w-72"
          />
        </div>
      </main>
    </>
  )
}

export default AdminPage
