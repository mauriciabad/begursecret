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

      <div className="mx-auto mt-10  max-w-sm">
        <h2 className="mb-2 text-center font-title text-2xl font-semibold uppercase text-stone-800">
          {t('login')}
        </h2>
        <ContinueWithEmail />

        <div className="mb-2 mt-4 flex items-center gap-2">
          <div className="flex-1 border-t border-stone-300" aria-hidden />
          <h3 className=" inline-block font-title text-sm font-medium uppercase text-stone-600">
            {t('continue-with')}
          </h3>
          <div className="flex-1 border-t border-stone-300" aria-hidden />
        </div>
        <ContinueWithProvider isProduction={env.NODE_ENV === 'production'} />

        <h2 className="mb-2 mt-10 text-center font-title text-2xl font-semibold uppercase text-stone-800">
          {t('register')}
        </h2>
        <LinkButton href="/register" variant="solid" color="primary" fullWidth>
          {t('register')}
        </LinkButton>
      </div>
    </>
  )
}
