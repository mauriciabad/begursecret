import 'leaflet/dist/leaflet.css'

import { IconLoader } from '@tabler/icons-react'
import type { Map as LeafletMap } from 'leaflet'
import dynamic from 'next/dynamic'
import { ComponentProps, createContext, forwardRef, useContext } from 'react'
import { cn } from '~/helpers/cn'

export const LazyMapContainer = dynamic(
  () =>
    import('../to-be-lazy-loaded/map-container').then((m) => m.MapContainer),
  {
    loading: () => {
      const { className } = useContext(LoadingPropsCtx)
      return (
        <div
          className={cn(
            className,
            'flex items-center justify-center bg-[#dddddd]'
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

export const NextMapContainer = forwardRef<
  LeafletMap,
  ComponentProps<typeof LazyMapContainer>
>((props, ref) => (
  <LoadingPropsCtx.Provider value={{ className: props.className }}>
    <LazyMapContainer {...props} forwardedRef={ref} />{' '}
  </LoadingPropsCtx.Provider>
))
