import {
  IconAlertTriangle,
  IconAlertTriangleFilled,
  IconInfoCircle,
} from '@tabler/icons-react'
import { FC, ReactNode } from 'react'
import { cn } from '~/helpers/cn'

export const AlertBox: FC<{
  type?: 'info' | 'warning' | 'error'
  className?: string
  children: ReactNode
}> = ({ type = 'info', className, children }) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-800',
        { 'bg-blue-50 text-blue-800': type === 'info' },
        { 'bg-yellow-50 text-yellow-800': type === 'warning' },
        { 'bg-red-50 text-red-800': type === 'error' },
        className
      )}
      role="alert"
    >
      {type === 'info' && <IconInfoCircle className="shrink-0" size={20} />}
      {type === 'warning' && (
        <IconAlertTriangle className="shrink-0" size={20} />
      )}
      {type === 'error' && (
        <IconAlertTriangleFilled className="shrink-0" size={20} />
      )}

      <div className="leading-none">{children}</div>
    </div>
  )
}
