'use client'

import L, { Map as LeafletMap, divIcon } from 'leaflet'
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import 'leaflet/dist/leaflet.css'
import { useRouter } from 'next-intl/client'
import { FC, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, Marker } from 'react-leaflet'
import { cn } from '~/helpers/cn'
import { MapPoint } from '~/helpers/spatial-data'
import { CustomLayersControl } from './custom-layout-controls'
import { CustomLocationControl } from './custom-location-control'
import { PlaceMarker, PlaceMarkerProps } from './place-marker'
import { useMapControlledZoom } from './useMapControlledZoom'
import { useMapResize } from './useMapResize'

const DEFAULT_CENTER = {
  lat: 41.958627,
  lng: 3.213765,
} as const satisfies MapPoint

export const mapContainerClassName = 'z-0 h-64 w-full'

export const MapRaw: FC<{
  center?: MapPoint
  className?: string
  zoom?: number
  fullControl?: boolean
  markers?: (PlaceMarkerProps & {
    location: MapPoint
    url?: string
  })[]
  classNames?: {
    controls?: string
  }
}> = ({
  center = DEFAULT_CENTER,
  className,
  markers,
  fullControl,
  zoom: initialZoom = 14,
  classNames = {},
}) => {
  const router = useRouter()
  const [map, setMap] = useState<LeafletMap | null>(null)

  useMapResize(map)

  const { zoom } = useMapControlledZoom(map, initialZoom)

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      scrollWheelZoom={fullControl}
      dragging={fullControl || !L.Browser.mobile}
      className={cn(mapContainerClassName, className)}
      ref={setMap}
      attributionControl={false}
    >
      {markers?.map(
        ({ location, url: markerUrl, size, ...placeMarkerProps }) => (
          <Marker
            key={`${location.lat}-${location.lng}`}
            position={location}
            icon={divIcon({
              html: renderToStaticMarkup(
                <PlaceMarker
                  {...placeMarkerProps}
                  size={size ?? (zoom >= 14 ? 'normal' : 'tiny')}
                />
              ),
              iconSize: [0, 0],
              className:
                '!flex justify-center items-center border-0 bg-none [&>*]:shrink-0',
            })}
            eventHandlers={
              markerUrl
                ? {
                    click: () => {
                      console.log('click', markerUrl)
                      router.push(markerUrl)
                    },
                  }
                : {}
            }
          ></Marker>
        )
      )}

      <div
        className={cn(
          'absolute bottom-4 right-4 z-[1000] flex flex-col-reverse gap-2',
          classNames.controls
        )}
      >
        <CustomLayersControl />
        <CustomLocationControl />
      </div>
    </MapContainer>
  )
}
