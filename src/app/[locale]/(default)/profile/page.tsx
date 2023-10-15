import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { AuthRequired } from '~/components/auth-required'
import { SigninLink } from '~/components/signin-link'
import { UserLogin } from '~/components/user-login'

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
      <h1 className="mb-8 text-2xl">{t('heading')}</h1>
      <p>{t('content')}</p>
      <AuthRequired
        fallback={
          <div>
            {t.rich('signIn', {
              link: (chunks) => <SigninLink>{chunks}</SigninLink>,
            })}
          </div>
        }
      >
        <p>{t('authenticated')}</p>
      </AuthRequired>
      <UserLogin />
    </>
  )
}

export default ProfilePage
