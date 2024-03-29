import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'
import type { FC } from 'react'
import { Logo } from '~/components/icons/logo'
import { LanguageSwitcher } from '~/components/inputs/language-switcher'
import { LinkButtonCustom } from '~/components/links/link-button-custom'
import { parseLocale, type LocaleRouteParams } from '~/i18n'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'home' })
  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
    description: t('meta.description'),
  }
}

const HomePage: FC<LocaleRouteParams> = ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)
  redirect('/explore') // TODO: remove this line when the home page is ready

  const t = useTranslations('home')

  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-4 text-center text-stone-800">
        <div className="origin-bottom animate-wiggle">
          <Logo
            className="mb-4 animate-hover text-brand-600"
            outline
            stroke={1.25}
            size={96}
          />
        </div>

        <h1 className="font-title text-4xl font-bold uppercase text-stone-800">
          {t('heading')}
        </h1>

        <p className="mt-4 text-xl">{t('subtitle')}</p>

        <LinkButtonCustom href="/explore">{t('launch-app')}</LinkButtonCustom>

        <LanguageSwitcher className="mt-12" />
      </main>
    </>
  )
}

export default HomePage
