import { Image } from '@nextui-org/react'
import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { FC } from 'react'
import image404Map from '~/../public/images/404-map.png'
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

const NotFoundPage: FC<Partial<LocaleRouteParams>> = ({ params }) => {
  const locale = parseLocale(params?.locale)
  unstable_setRequestLocale(locale)

  const t = useTranslations('error-pages.not-found')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-32">
      <Image {...image404Map} alt="" className="w-full max-w-[16rem]" />
      <h1 className="mb-8 text-center font-title text-3xl font-bold uppercase text-stone-800 lg:text-6xl lg:font-extrabold">
        {t('title')}
      </h1>

      <LinkButtonCustom href="/">{t('go-home')}</LinkButtonCustom>
    </main>
  )
}

export default NotFoundPage
