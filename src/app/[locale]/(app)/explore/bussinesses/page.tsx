import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import { parseLocale, type LocaleRouteParams } from '~/i18n'
import { OverrideMainMap } from '../_components/override-main-map'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'explore.bussinesses',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const BussinessesPage: FC<LocaleRouteParams> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  return (
    <>
      <OverrideMainMap reset />

      <p>Bussinesses tab</p>
    </>
  )
}

export default BussinessesPage
