'use client'

import { Button } from '@nextui-org/react'
import { IconCheck, IconRefresh } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC, useState } from 'react'
import { cn } from '~/helpers/cn'

export const RevalidateButton: FC<{
  className?: string
}> = ({ className }) => {
  const t = useTranslations('admin')
  const [done, setDone] = useState(false)

  return (
    <Button
      startContent={done ? <IconCheck /> : <IconRefresh />}
      disabled={done}
      variant="faded"
      className={cn(className)}
      onPress={() => {
        setDone(true)
      }}
    >
      {done ? t('publish-triggered') : t('publish-changes')}
    </Button>
  )
}
