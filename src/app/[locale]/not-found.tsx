import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { FC } from 'react'
import { LinkButtonCustom } from '~/components/links/link-button-custom'
import { LocaleRouteParams, parseLocale } from '~/i18n'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'error-pages.not-found',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const NotFoundPage: FC<LocaleRouteParams> = ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

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

export default NotFoundPage
