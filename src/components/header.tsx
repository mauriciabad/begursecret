import { cn } from '~/helpers/cn'
import type { FC, HTMLAttributes } from 'react'

export const Header: FC<Omit<HTMLAttributes<HTMLElement>, 'children'>> = ({
  className,
  ...props
}) => {
  return (
    <header
      className={cn(
        'container mx-auto flex items-center justify-between p-4',
        className
      )}
      {...props}
    >
      
    </header>
  )
}
