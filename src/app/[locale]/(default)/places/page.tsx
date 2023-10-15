import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'

import { AuthRequired } from '~/components/auth-required'
import { HomeLink } from '~/components/home-link'
import type { LocaleRouteParams } from '~/i18n'
import { PlaceList } from './_components/place-list'
import { PlaceSigninFallback } from './_components/place-signin-fallback'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'places')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const PlacesPage: FC<LocaleRouteParams> = () => {
  const t = useTranslations('places')
  return (
    <>
      <h1 className="mb-8 text-2xl">{t('heading')}</h1>
      <AuthRequired fallback={<PlaceSigninFallback />}>
        <p>You are authenticated and can see this content. </p>
      </AuthRequired>
      <PlaceList />
      <div className="mt-8">
        <HomeLink />
      </div>
    </>
  )
}

export default PlacesPage
