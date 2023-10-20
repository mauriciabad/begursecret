import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { LinkButton } from '~/components/link-button'
import { ContinueWithProvider } from './continue-with-provider'
import { ContinueWithEmail } from './continue-with-email'
import { env } from 'process'

export const ProfileLogin: FC = () => {
  const t = useTranslations('profile.login')

  return (
    <>
      <div className="h-auto rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-cover bg-center object-fill p-6 text-white shadow-lg shadow-purple-500/50">
        <div className="mb-10 ">
          <p className="text-sm font-bold uppercase">{t('banner.subtitle')}</p>
          <h3 className="font-title text-3xl font-bold">{t('banner.title')}</h3>
          <p className="text-lg leading-none">{t('banner.text')}</p>
        </div>

        <LinkButton
          href="/register"
          radius="full"
          className="bg-white font-medium uppercase text-purple-500"
        >
          {t('register')}
        </LinkButton>
      </div>

      <h2 className="mt-8 font-title text-2xl font-medium">
        {t('login-with')}
      </h2>
      <ContinueWithEmail />
      <ContinueWithProvider
        className="mt-8"
        isProduction={Boolean(env.IS_PRODUCTION)}
      />

      <h2 className="mt-8 font-title text-2xl font-medium">{t('register')}</h2>
      <LinkButton href="/register" variant="solid" color="primary">
        {t('register')}
      </LinkButton>
    </>
  )
}
