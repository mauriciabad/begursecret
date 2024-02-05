import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import type { LocaleRouteParams } from '~/i18n'
import { redirect } from '~/navigation'
import { getSession } from '~/server/get-server-thing'
import { CompleteProfileForm } from './_components/complete-profile-form'

export const runtime = 'edge'

export async function generateMetadata({
  params: { locale },
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'profile.completeProfile',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const CompleteProfilePage: FC<LocaleRouteParams> = async () => {
  const session = await getSession()
  if (!session) return redirect('/profile')

  const profile = {
    name: session.user.name ?? undefined,
  }

  return (
    <>
      <CompleteProfileForm defaultValues={profile} />
    </>
  )
}

export default CompleteProfilePage
