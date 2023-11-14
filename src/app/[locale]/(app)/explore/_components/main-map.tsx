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
import { MapMarker } from '~/components/map/map-raw'
import { cn } from '~/helpers/cn'

const MainMapCtx = createContext<{
  map: LeafletMap | null
  originalMarkers: MapMarker[]
  setMarkers: (markers: MapMarker[]) => void
}>({
  map: null,
  originalMarkers: [],
  setMarkers: () => {},
})

export const useMainMap = () => useContext(MainMapCtx)

export const MainMap: FC<PropsWithChildren<{ markers: MapMarker[] }>> = ({
  markers: originalMarkers,
  children,
}) => {
  const [map, setMap] = useState<LeafletMap | null>(null)
  const [markers, setMarkers] = useState<MapMarker[]>(originalMarkers)

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
        markers={markers}
        innerRef={setMap}
      />

      <MainMapCtx.Provider value={{ map, originalMarkers, setMarkers }}>
        {children}
      </MainMapCtx.Provider>
    </>
  )
}
