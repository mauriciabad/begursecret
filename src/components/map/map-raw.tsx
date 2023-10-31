'use client'

import L, { Icon, LatLngLiteral, Map as LeafletMap, divIcon } from 'leaflet'
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import 'leaflet/dist/leaflet.css'
import { useRouter } from 'next-intl/client'
import { FC, useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, Marker, Popup } from 'react-leaflet'
import { cn } from '~/helpers/cn'
import { PlaceType } from '~/server/db/constants/places'
import { CustomLayersControl } from './custom-layout-controls'
import { CustomLocationControl } from './custom-location-control'
import { PlaceMarker } from './place-marker'
import IconMapPin from '/public/icon-map-pin.svg'

const DEFAULT_CENTER = {
  lat: 41.958627,
  lng: 3.213765,
} as const satisfies LatLngLiteral

export const mapContainerClassName = 'z-0 h-64 w-full'

export const MapRaw: FC<{
  center?: LatLngLiteral
  className?: string
  zoom?: number
  fullControl?: boolean
  markers?: {
    location: LatLngLiteral
    text?: string
    markerType?: PlaceType
    url?: string
  }[]
}> = ({
  center = DEFAULT_CENTER,
  className,
  markers,
  fullControl,
  zoom = 14,
}) => {
  const router = useRouter()
  const [map, setMap] = useState<LeafletMap | null>(null)

  useEffect(() => {
    if (map) {
      const resizeObserver = new ResizeObserver(() => map.invalidateSize())

      const container = map.getContainer()
      resizeObserver.observe(container)

      return () => {
        resizeObserver.unobserve(container)
      }
    }
  }, [map])

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
      {markers?.map(({ text, location, markerType, url: markerUrl }) => (
        <Marker
          key={`${location.lat}-${location.lng}`}
          position={location}
          icon={
            markerType
              ? divIcon({
                  html: renderToStaticMarkup(<PlaceMarker type={markerType} />),
                  iconSize: [0, 0],
                })
              : new Icon({
                  iconUrl: IconMapPin.src,
                  iconAnchor: [94 * 0.3 * 0.5, 128 * 0.3 * 1],
                  iconSize: [94 * 0.3, 128 * 0.3],
                })
          }
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
        >
          {text && <Popup>{text}</Popup>}
        </Marker>
      ))}

      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col-reverse gap-2">
        <CustomLayersControl />
        <CustomLocationControl />
      </div>
    </MapContainer>
  )
}
