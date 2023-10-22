import type { Metadata } from 'next'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import type { LocaleRouteParams } from '~/i18n'
import { RegisterForm } from './_components/register-form'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'register')
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
