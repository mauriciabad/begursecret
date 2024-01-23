'use client'

import { Button } from '@nextui-org/button'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

export const LogoutButton: FC = () => {
  const t = useTranslations('admin.more-options')

  return (
    <Button
      onClick={() => signOut({ callbackUrl: '/admin-login' })}
      className="mt-6 bg-brand-600 px-8 py-3 uppercase text-white"
    >
      {t('logout')}
    </Button>
  )
}
