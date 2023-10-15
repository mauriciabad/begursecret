import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'

import type { LocaleRouteParams } from '~/i18n'
import { PlaceList } from './_components/place-list'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'explore')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const ExplorePage: FC<LocaleRouteParams> = () => {
  const t = useTranslations('explore')
  return (
    <>
      <h1 className="mb-8 text-2xl">{t('heading')}</h1>
      <PlaceList />
    </>
  )
}

export default ExplorePage
