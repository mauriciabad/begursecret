'use client'

import { Button } from '@nextui-org/button'
import { IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react'
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
    <div
      className={cn(
        'grid grid-cols-2 gap-2 xs:gap-4',
        !isProduction &&
          'relative cursor-not-allowed after:pointer-events-none after:absolute after:-inset-2 after:z-10 after:flex after:items-center after:justify-center after:rounded-xl after:bg-stone-200/70 after:px-4 after:text-center after:font-bold after:opacity-0 after:transition-opacity after:duration-300 after:ease-in-out after:content-[attr(data-after)] hover:after:opacity-100',
        className
      )}
      data-after={t('not-supported')}
      tabIndex={isProduction ? undefined : -1}
      aria-hidden={!isProduction}
    >
      <Button
        onClick={() => signIn('google')}
        variant="solid"
        className="bg-rose-600 text-white"
        startContent={<IconBrandGoogle size={20} />}
      >
        <span className="flex-grow">{t('providers.google')}</span>
      </Button>
      <Button
        onClick={() => signIn('facebook')}
        variant="solid"
        className="bg-blue-600 text-white"
        startContent={<IconBrandFacebook size={20} />}
      >
        <span className="flex-grow">{t('providers.facebook')}</span>
      </Button>
    </div>
  )
}
