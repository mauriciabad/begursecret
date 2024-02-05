import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import type { LocaleRouteParams } from '~/i18n'
import { RegisterForm } from './_components/register-form'

export async function generateMetadata({
  params: { locale },
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'register',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const RegisterPage: FC<LocaleRouteParams> = () => {
  return (
    <>
      <RegisterForm />
    </>
  )
}

export default RegisterPage
