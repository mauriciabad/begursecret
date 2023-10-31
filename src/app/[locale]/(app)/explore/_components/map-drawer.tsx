import type { FC, PropsWithChildren } from 'react'
import { cn } from '~/helpers/cn'

type MapDrawerProps = PropsWithChildren<{
  classNames?: {
    wrapper?: string
    contents?: string
  }
}>

export const MapDrawer: FC<MapDrawerProps> = ({
  children,
  classNames = {},
}) => {
  return (
    <div className={cn('z-20 bg-[#fefefe]', classNames.wrapper)}>
      <div className="py-1">
        <div className="mx-auto h-1 w-8 rounded-full bg-stone-300" />
      </div>

      <div className={cn('mx-auto max-w-2xl', classNames.contents)}>
        {children}
      </div>
    </div>
  )
}
