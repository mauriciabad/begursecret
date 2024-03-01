import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import { parseLocale, type LocaleRouteParams } from '~/i18n'
import { redirect } from '~/navigation'
import { getSession } from '~/server/get-server-thing'
import { UserPreview } from './_components/user-preview'
import { UserTabs } from './_components/user-tabs'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'profile',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const ProfilePage: FC<LocaleRouteParams> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

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
