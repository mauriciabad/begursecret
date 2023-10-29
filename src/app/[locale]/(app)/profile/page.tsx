import type { Metadata } from 'next'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import type { LocaleRouteParams } from '~/i18n'
import { UserPreview } from './_components/user-preview'
import { getSession } from '~/server/get-server-thing'
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
  const session = await getSession()

  return <>{session ? <UserPreview user={session.user} /> : <ProfileLogin />}</>
}

export default ProfilePage
