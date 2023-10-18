import type { Metadata } from 'next'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { LanguageSwitcher } from '~/components/language-switcher'
import type { LocaleRouteParams } from '~/i18n'
import { UserPreview } from './_components/user-preview'
import { getServerSession } from 'next-auth'
import { authOptions } from '~/server/auth'
import { ProfileLogin } from './_components/profile-login'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'profile')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const ProfilePage: FC<LocaleRouteParams> = async () => {
  const session = await getServerSession(authOptions)

  return (
    <>
      {session ? (
        <>
          <UserPreview user={session.user} />
          <LanguageSwitcher />
        </>
      ) : (
        <>
          <ProfileLogin />
          <LanguageSwitcher />
        </>
      )}
    </>
  )
}

export default ProfilePage
