import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import { UnderConstruction } from '~/components/generic/under-construction'
import { parseLocale, type LocaleRouteParams } from '~/i18n'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'hub' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const HubPage: FC<LocaleRouteParams> = ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const t = useTranslations('hub')
  return (
    <>
      <UnderConstruction />
      <p className="text-center">{t('content')}</p>
    </>
  )
}

export default HubPage
