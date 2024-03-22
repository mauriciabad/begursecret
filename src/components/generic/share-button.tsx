'use client'

import { Button } from '@nextui-org/react'
import { IconShare3 } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC, memo } from 'react'
import { cn } from '~/helpers/cn'

export const ShareButton: FC<{
  data: ShareData
  className?: string
}> = memo(({ data, className }) => {
  const t = useTranslations('common')

  if (!navigator.share) return null
  if (navigator.canShare(data) === false) {
    console.error('Cannot share', data)
    return null
  }

  return (
    <Button
      onPress={async () => {
        await navigator.share(data)
      }}
      className={cn('h-7 gap-1 px-2', className)}
      variant="bordered"
      size="sm"
      radius="full"
      startContent={<IconShare3 size={16} />}
    >
      {t('share')}
    </Button>
  )
})
