import { Icon } from '@tabler/icons-react'
import { FC } from 'react'
import { cn } from '~/helpers/cn'

export const IconTitle: FC<{
  icon: Icon
  title: string
  className?: string
}> = ({ icon, title, className }) => {
  const Icon = icon
  return (
    <h2
      className={cn(
        'mb-2 mt-4 text-balance font-title text-lg font-semibold',
        className
      )}
    >
      <Icon size={24} className="mr-1 inline-block align-middle" />
      <span>{title}</span>
    </h2>
  )
}
