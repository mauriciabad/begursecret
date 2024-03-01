import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import { parseLocale, type LocaleRouteParams } from '~/i18n'
import { redirect } from '~/navigation'
import { getSession } from '~/server/get-server-thing'
import { CompleteProfileForm } from './_components/complete-profile-form'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'profile.completeProfile',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const CompleteProfilePage: FC<LocaleRouteParams> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

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
