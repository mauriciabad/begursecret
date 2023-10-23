import type { Metadata } from 'next'
import { getTranslator, redirect } from 'next-intl/server'
import type { FC } from 'react'
import type { LocaleRouteParams } from '~/i18n'
import { CompleteProfileForm } from './_components/complete-profile-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '~/server/auth'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'profile.completeProfile')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const CompleteProfilePage: FC<LocaleRouteParams> = async () => {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/profile')

  const profile = {
    name: session.user.name ?? undefined,
  }

  return (
    <>
      <CompleteProfileForm userId={session.user.id} defaultValues={profile} />
    </>
  )
}

export default CompleteProfilePage
