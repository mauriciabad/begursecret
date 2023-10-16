import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'

import type { LocaleRouteParams } from '~/i18n'
import { PlaceList } from './_components/place-list'
import { UnderConstruction } from '~/components/under-construction'

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
      <PlaceList />
      <UnderConstruction />
      <p className="text-center">{t('content')}</p>
    </>
  )
}

export default ExplorePage
