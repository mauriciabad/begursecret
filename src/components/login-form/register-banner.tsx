import { Button } from '@nextui-org/button'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { cn } from '~/helpers/cn'
import { Link } from '~/navigation'

export const RegisterBanner: FC<{
  className?: string
}> = ({ className }) => {
  const t = useTranslations('profile.register-banner')
  return (
    <Link
      href="/register"
      className={cn(
        'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-cover bg-center',
        'text-white shadow-lg shadow-purple-500/50',
        'block h-auto rounded-xl object-fill p-6',
        className
      )}
    >
      <div className="mb-10">
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
