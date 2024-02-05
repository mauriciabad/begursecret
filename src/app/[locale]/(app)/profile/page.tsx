import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import type { LocaleRouteParams } from '~/i18n'
import { redirect } from '~/navigation'
import { getSession } from '~/server/get-server-thing'
import { UserPreview } from './_components/user-preview'
import { UserTabs } from './_components/user-tabs'

export async function generateMetadata({
  params: { locale },
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'profile',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const ProfilePage: FC<LocaleRouteParams> = async () => {
  const session = await getSession()
  if (!session) {
    return redirect('/profile/login')
  }

  return (
    <>
      <UserPreview user={session.user} className="bg-white p-4" />
      <UserTabs />
    </>
  )
}

export default ProfilePage
