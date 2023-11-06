'use client'

import { Button } from '@nextui-org/button'
import { IconPhoto } from '@tabler/icons-react'
import { FC } from 'react'
import { cn } from '~/helpers/cn'

export const ViewMoreImagesButtonAndDialog: FC<{
  images: {
    key: string
  }[]
  buttonText: string
  className?: string
}> = ({ buttonText, className }) => {
  return (
    <Button
      radius="lg"
      variant="bordered"
      startContent={<IconPhoto size={24} />}
      className={cn(
        'flex flex-col items-center justify-center gap-1 font-semibold',
        className
      )}
    >
      {buttonText}
    </Button>
  )
}
