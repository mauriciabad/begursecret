import { Button } from '@nextui-org/button'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { FC } from 'react'
import { cn } from '~/helpers/cn'

export const RegisterBanner: FC<{
  className?: string
}> = ({ className }) => {
  const t = useTranslations('profile.register-banner')
  return (
    <Link
      href="/register"
      className="block h-auto rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-cover bg-center object-fill p-6 text-white shadow-lg shadow-purple-500/50"
    >
      <div className={cn('mb-10', className)}>
        <p className="text-sm font-bold uppercase">{t('subtitle')}</p>
        <p className="font-title text-3xl font-bold uppercase">{t('title')}</p>
        <p className="text-lg leading-none">{t('text')}</p>
      </div>

      <Button
        radius="full"
        className="bg-white font-medium uppercase text-purple-600"
        tabIndex={-1}
      >
        {t('register')}
      </Button>
    </Link>
  )
}
