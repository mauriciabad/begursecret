import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import { LoginForm } from '~/components/login-form/login-form'
import type { LocaleRouteParams } from '~/i18n'
import { redirect } from '~/navigation'
import { getSession } from '~/server/get-server-thing'

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

const LoginPage: FC<LocaleRouteParams> = async () => {
  const session = await getSession()

  if (session) {
    return redirect('/profile')
  }

  return (
    <main className="mx-auto w-full max-w-2xl py-3">
      <LoginForm />
    </main>
  )
}

export default LoginPage
