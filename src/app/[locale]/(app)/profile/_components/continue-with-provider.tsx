'use client'

import { Button } from '@nextui-org/button'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { GoogleGLogo } from '~/components/icons/google-g-logo'
import { cn } from '~/helpers/cn'

export const ContinueWithProvider: FC<{
  className?: string
  isProduction?: boolean
}> = ({ className, isProduction }) => {
  const t = useTranslations('profile.login')

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center',
        !isProduction &&
          'relative cursor-not-allowed after:pointer-events-none after:absolute after:-inset-2 after:z-10 after:flex after:items-center after:justify-center after:rounded-xl after:bg-stone-200/70 after:px-4 after:text-center after:font-bold after:leading-3 after:opacity-0 after:transition-opacity after:duration-300 after:ease-in-out after:content-[attr(data-after)] hover:after:opacity-100',
        className
      )}
      data-after={t('not-supported')}
      tabIndex={isProduction ? undefined : -1}
      aria-hidden={!isProduction}
    >
      <Button
        onClick={() =>
          signIn('google', { callbackUrl: '/api/auth/callback/google' })
        }
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
