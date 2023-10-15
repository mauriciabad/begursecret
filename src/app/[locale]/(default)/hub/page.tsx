import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'

import type { LocaleRouteParams } from '~/i18n'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'hub')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const HubPage: FC<LocaleRouteParams> = () => {
  const t = useTranslations('hub')
  return (
    <>
      <h1 className="mb-8 text-2xl">{t('heading')}</h1>
      <p>{t('content')}</p>
    </>
  )
}

export default HubPage
