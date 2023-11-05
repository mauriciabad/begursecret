import { FC } from 'react'
import { cn } from '~/helpers/cn'

export const DividerWithText: FC<{ className?: string; text: string }> = ({
  text,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1 text-sm font-medium uppercase text-stone-600',
        className
      )}
      role="separator"
    >
      <div className="h-divider flex-1 bg-stone-300" />
      <span>{text}</span>
      <div className="h-divider flex-1 bg-stone-300" />
    </div>
  )
}
