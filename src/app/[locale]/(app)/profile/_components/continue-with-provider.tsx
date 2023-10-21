'use client'

import { Button } from '@nextui-org/button'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { GoogleGLogo } from '~/components/icons/google-g-logo'
import { cn } from '~/helpers/cn'

export const ContinueWithProvider: FC<{
  className?: string
}> = ({ className }) => {
  const t = useTranslations('profile.login')

  return (
    <div
      className={cn('flex flex-wrap items-center justify-center', className)}
      data-after={t('not-supported')}
    >
      <Button
        onClick={() => signIn('google')}
        variant="solid"
        className=" border border-stone-200 bg-white text-stone-800 shadow-md"
        fullWidth
        startContent={<GoogleGLogo size={20} />}
      >
        <span className="flex-grow">{t('providers.google')}</span>
      </Button>
    </div>
  )
}
