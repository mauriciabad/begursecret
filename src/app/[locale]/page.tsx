import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'

import { TextLink } from '~/components/text-link'
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
      <main className="mx-auto max-w-2xl px-4">
        <h1 className="mb-8 text-2xl">{t('heading')}</h1>

        <TextLink href="/explore" className="text-center">
          {t('lunchApp')}
        </TextLink>
      </main>
    </>
  )
}

export default HomePage
