import { IconBarrierBlockOff } from '@tabler/icons-react'
import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import type { LocaleRouteParams } from '~/i18n'
import { ProfileLogin } from '../(app)/profile/login/_components/profile-login'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'admin')
  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
    description: t('meta.description'),
  }
}

const AdminLoginPage: FC<LocaleRouteParams> = () => {
  const t = useTranslations('admin-login')

  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-4 text-center text-stone-800">
        <IconBarrierBlockOff
          className="mx-auto mb-4 text-brand-600"
          stroke={1.25}
          size={96}
        />

        <h1 className="font-title text-4xl font-bold uppercase text-stone-800">
          {t('heading')}
        </h1>

        <p className="mt-4 text-xl">{t('subtitle')}</p>

        <ProfileLogin />
      </main>
    </>
  )
}

export default AdminLoginPage
