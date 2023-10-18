'use client'

import { Button } from '@nextui-org/button'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

export const ProfileLogin: FC = () => {
  const t = useTranslations('profile.login')

  return (
    <>
      <div className="h-auto rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-cover bg-center object-fill p-6 text-white shadow-lg shadow-purple-500/50">
        <div className="mb-10 ">
          <p className="text-sm font-bold uppercase">{t('banner.subtitle')}</p>
          <p className="text-3xl font-bold">{t('banner.title')}</p>
          <p className="text-lg leading-none">{t('banner.text')}</p>
        </div>

        <Button
          onClick={() => signIn()}
          variant="solid"
          radius="full"
          className="bg-white font-medium text-purple-500"
        >
          {t('register')}
        </Button>
      </div>

      <h2 className="mt-8 text-2xl font-medium">{t('login')}</h2>
      <Button onClick={() => signIn()} variant="solid" color="primary">
        {t('login')}
      </Button>

      <h2 className="mt-8 text-2xl font-medium">{t('register')}</h2>
      <Button onClick={() => signIn()} variant="solid" color="primary">
        {t('register')}
      </Button>
    </>
  )
}
