'use client'

import { Button } from '@nextui-org/button'
import { IconLogin } from '@tabler/icons-react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

export const ProfileLogin: FC = () => {
  const t = useTranslations('profile.login')

  return (
    <>
      <h2 className="text-2xl font-bold">{t('register')}</h2>

      <Button
        onClick={() => signIn()}
        variant="solid"
        color="primary"
        startContent={<IconLogin />}
      >
        {t('login')}
      </Button>
    </>
  )
}
