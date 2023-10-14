'use client'

import { Button } from '@nextui-org/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import type { ButtonHTMLAttributes, FC } from 'react'

export const UserLogin: FC<
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>
> = () => {
  const t = useTranslations('common.userLogin')
  const { data: session } = useSession()

  const handleClick = () => {
    if (session) signOut({ callbackUrl: '/' })
    else signIn()
  }

  return (
    <Button onClick={handleClick}>
      {session
        ? t('signOutText', { userName: session.user?.name })
        : t('signInText')}
    </Button>
  )
}
