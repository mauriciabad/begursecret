import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import { UnderConstruction } from '~/components/generic/under-construction'
import type { LocaleRouteParams } from '~/i18n'

export async function generateMetadata({
  params: { locale },
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'hub' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const HubPage: FC<LocaleRouteParams> = () => {
  const t = useTranslations('hub')
  return (
    <>
      <UnderConstruction />
      <p className="text-center">{t('content')}</p>
    </>
  )
}

export default HubPage
