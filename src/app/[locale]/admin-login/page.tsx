import { IconBarrierBlock, IconBolt } from '@tabler/icons-react'
import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import { LoginForm } from '~/components/login-form/login-form'
import { parseLocale, type LocaleRouteParams } from '~/i18n'
import { redirect } from '~/navigation'
import { getSession } from '~/server/get-server-thing'
import { LogoutButton } from './__components/logout-button'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'admin' })
  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
    description: t('meta.description'),
  }
}

const AdminLoginPage: FC<LocaleRouteParams> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const session = await getSession()

  if (session?.user.role === 'admin') {
    return redirect('/admin')
  }

  const isLoggedInAsNotAdmin = !!session && session.user.role !== 'admin'

  const t = await getTranslations('admin-login')

  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-4 text-center text-stone-800">
        {isLoggedInAsNotAdmin ? (
          <>
            <IconBarrierBlock
              className="mx-auto mb-4 text-brand-600"
              stroke={1.25}
              size={96}
            />

            <h1 className="font-title text-4xl font-bold uppercase text-stone-800">
              {t('heading')}
            </h1>

            <p className="mt-4 text-xl">{t('subtitle')}</p>
            <LogoutButton />
          </>
        ) : (
          <div className="mb-24">
            <LoginForm
              registerDisabled={true}
              title={t('login-title')}
              icon={IconBolt}
            />
          </div>
        )}
      </main>
    </>
  )
}

export default AdminLoginPage
