import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { LinkButtonCustom } from '~/components/links/link-button-custom'
import { LocaleRouteParams } from '~/i18n'

export async function generateMetadata({
  params: { locale },
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'error-pages.not-found',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default function NotFoundPage() {
  const t = useTranslations('error-pages.not-found')

  return (
    <main className="flex flex-col items-center justify-center py-32">
      <h1 className="mb-8 mt-4 text-center font-title text-6xl font-extrabold uppercase text-stone-800">
        {t('title')}
      </h1>

      <LinkButtonCustom href="/">{t('go-home')}</LinkButtonCustom>
    </main>
  )
}
