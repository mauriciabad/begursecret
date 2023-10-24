import { IconInfoCircle } from '@tabler/icons-react'
import { FC, ReactNode } from 'react'
import { cn } from '~/helpers/cn'

export const AlertBox: FC<{
  type?: 'info'
  className?: string
  children: ReactNode
}> = ({ type, className, children }) => {
  return (
    <div
      className={cn(
        'mb-4 flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-800',
        { 'bg-blue-50 text-blue-800': type === 'info' },
        className
      )}
      role="alert"
    >
      {type === 'info' && <IconInfoCircle size={20} />}
      <div>{children}</div>
    </div>
  )
}
