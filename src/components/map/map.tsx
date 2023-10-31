'use client'

import { IconLoader } from '@tabler/icons-react'
import dynamic from 'next/dynamic'
import { createContext, useContext } from 'react'
import { cn } from '~/helpers/cn'

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
            'z-0 flex h-64 w-full items-center justify-center bg-[#f2efe9]',
            className
          )}
        >
          <IconLoader className="mr-1 h-4 w-4 animate-spin" />
          <span className="animate-pulse">Loading map...</span>
        </div>
      )
    },
    ssr: false,
  }
)

const LoadingPropsCtx = createContext<{ className?: string }>({})

export const Map: typeof DynamicMap = (props) => (
  <LoadingPropsCtx.Provider value={{ className: props.className }}>
    <DynamicMap {...props} />
  </LoadingPropsCtx.Provider>
)
