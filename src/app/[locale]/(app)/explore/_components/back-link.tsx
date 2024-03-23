'use client'

import { IconArrowLeft } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { Link, usePathname } from '~/navigation'

export const BackLink: FC = () => {
  const t = useTranslations('explore')
  const pathname = usePathname()
  if (pathname === '/explore') return null

  return (
    <Link href="/explore" className="flex h-full self-stretch">
      <IconArrowLeft size={24} />
      <span className="ml-2">{t('back')}</span>
    </Link>
  )
}
