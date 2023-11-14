'use client'

import { Map as LeafletMap } from 'leaflet'
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react'
import { Map } from '~/components/map/map'
import { cn } from '~/helpers/cn'

const MainMapCtx = createContext<LeafletMap | null>(null)

export const useMainMap = () => useContext(MainMapCtx)

export const MainMap: FC<PropsWithChildren<{ places: any[] }>> = ({
  places,
  children,
}) => {
  const [map, setMap] = useState<LeafletMap | null>(null)

  return (
    <>
      <Map
        className={cn(
          'min-h-[calc(100dvh_-_192px)]',
          'sticky top-16 grow',
          '-mb-2 box-content pb-2'
        )}
        classNames={{
          controls: 'bottom-6',
        }}
        fullControl
        zoom={14}
        markers={places.map((place) => ({
          location: place.location,
          icon: place.mainCategory.icon,
          color: place.mainCategory.color,
          url: `/explore/places/${place.id}`,
        }))}
        innerRef={setMap}
      />

      <MainMapCtx.Provider value={map}>{children}</MainMapCtx.Provider>
    </>
  )
}
