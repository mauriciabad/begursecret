'use server'

import { FC } from 'react'
import { cn } from '~/helpers/cn'
import { revalidateAll } from '~/helpers/revalidate-all'
import { RevalidateButton } from './revalidate-button'

export const RevalidateForm: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <form
      action={revalidateAll}
      className={cn(className, 'flex justify-center')}
    >
      <RevalidateButton />
    </form>
  )
}
