import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { LanguageSwitcher } from '~/components/language-switcher'

import type { LocaleRouteParams } from '~/i18n'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'profile')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const ProfilePage: FC<LocaleRouteParams> = () => {
  const t = useTranslations('profile')
  return (
    <>
      <p>{t('content')}</p>

      <LanguageSwitcher />
    </>
  )
}

export default ProfilePage
