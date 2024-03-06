import type { FC, PropsWithChildren } from 'react'
import { cn } from '~/helpers/cn'
import { ExploreTabs } from './explore-tabs'

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
    <div
      className={cn(
        'relative z-20 rounded-t-lg bg-[#fefefe] shadow-md',
        classNames.wrapper
      )}
    >
      <div className="absolute inset-x-0 top-1 z-40">
        <div className="mx-auto h-1 w-8 rounded-full bg-stone-300" />
      </div>

      <ExploreTabs className="sticky top-16 z-30 rounded-t-lg" />

      <div className={cn('mx-auto max-w-2xl', classNames.contents)}>
        {children}
      </div>
    </div>
  )
}
