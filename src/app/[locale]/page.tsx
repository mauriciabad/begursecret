import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { LanguageSwitcher } from '~/components/language-switcher'
import { LinkButton } from '~/components/link-button'
import { Logo } from '~/components/logo'
import type { LocaleRouteParams } from '~/i18n'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'home')
  return {
    description: t('meta.description'),
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
  }
}

const HomePage: FC<LocaleRouteParams> = () => {
  const t = useTranslations('home')

  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-4 text-center text-stone-800">
        <div className="origin-bottom animate-wiggle">
          <Logo
            className="anima mb-4 h-24 animate-hover text-brand-600"
            outline
            stroke={1.25}
          />
        </div>

        <h1 className="font-title text-4xl font-bold uppercase text-stone-800">
          {t('heading')}
        </h1>

        <p className="mt-4 text-xl">{t('subtitle')}</p>

        <LinkButton
          href="/explore"
          radius="full"
          variant="solid"
          color="primary"
          className=" mt-6 bg-brand-600 px-8 py-3 uppercase text-white"
        >
          {t('lunchApp')}
        </LinkButton>

        <LanguageSwitcher className="mt-12" />
      </main>
    </>
  )
}

export default HomePage
