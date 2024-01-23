import type { Metadata } from 'next'
import { getTranslator, redirect } from 'next-intl/server'
import type { FC } from 'react'
import type { LocaleRouteParams } from '~/i18n'
import { getSession } from '~/server/get-server-thing'
import { LoginForm } from '../../../../../components/login-form/login-form'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'profile')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const LoginPage: FC<LocaleRouteParams> = async () => {
  const session = await getSession()

  if (session) {
    redirect('/profile')
  }

  return (
    <main className="mx-auto w-full max-w-2xl py-3">
      <LoginForm />
    </main>
  )
}

export default LoginPage
