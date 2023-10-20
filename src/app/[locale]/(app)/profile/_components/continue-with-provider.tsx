'use client'

import { Button } from '@nextui-org/button'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { cn } from '~/helpers/cn'

export const ContinueWithProvider: FC<{
  className?: string
  isProduction?: boolean
}> = ({ className, isProduction }) => {
  const t = useTranslations('profile.login')

  return (
    <div className={cn('gap 4 flex flex-wrap', className)}>
      <Button
        onClick={() => signIn('github')}
        variant="solid"
        className="bg-black text-white"
        disabled={!isProduction}
      >
        {t('providers.github')}
      </Button>
    </div>
  )
}
