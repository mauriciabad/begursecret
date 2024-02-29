'use client'

import { IconLoader } from '@tabler/icons-react'
import dynamic from 'next/dynamic'
import { createContext, useContext, useMemo } from 'react'
import { cn } from '~/helpers/cn'
import { mapContainerClassName } from './map-raw'

const DynamicMap = dynamic(
  async () => {
    const { MapRaw: Map } = await import('./map-raw')
    return { default: Map }
  },
  {
    loading: () => {
      const { className } = useContext(LoadingPropsCtx)
      return (
        <div
          className={cn(
            mapContainerClassName,
            'flex items-center justify-center',
            className
          )}
        >
          <IconLoader className="animate mr-1 h-6 w-6 animate-spin text-stone-800 [animation-duration:2s]" />
        </div>
      )
    },
    ssr: false,
  }
)

const LoadingPropsCtx = createContext<{ className?: string }>({})

export const Map: typeof DynamicMap = (props) => {
  const Map = useMemo(() => DynamicMap, [])
  return (
    <LoadingPropsCtx.Provider value={{ className: props.className }}>
      <Map {...props} />
    </LoadingPropsCtx.Provider>
  )
}
