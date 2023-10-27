import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import { LinkButtonCustom } from '~/components/link-button-custom'
import { LocaleRouteParams } from '~/i18n'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'error-pages.not-found')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default function Page() {
  const t = useTranslations('error-pages.not-found')

  return (
    <main className="flex flex-col items-center justify-center py-32">
      <h1 className="mb-8 mt-4 text-center font-title text-6xl text-stone-800">
        {t('title')}
      </h1>

      <LinkButtonCustom href="/">{t('go-home')}</LinkButtonCustom>
    </main>
  )
}
