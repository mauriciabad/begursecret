'use client'

import { IconFocus2 } from '@tabler/icons-react'
import { Map as LeafletMap, divIcon } from 'leaflet'
import { FC, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, Marker } from 'react-leaflet'
import { cn } from '~/helpers/cn'
import { MapPoint } from '~/helpers/spatial-data'
import { useRouter } from '~/navigation'
import { CustomLayersControl, LayerId } from './custom-layout-controls'
import { CustomLocationControl } from './custom-location-control'
import { CustomRotationControl } from './custom-rotation-control'
import { PlaceMarker, PlaceMarkerProps } from './place-marker'
import { useMapControlledZoom } from './useMapControlledZoom'
import { useMapResize } from './useMapResize'

import 'leaflet-rotate'
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import 'leaflet/dist/leaflet.css'

const DEFAULT_CENTER = {
  lat: 41.953,
  lng: 3.2137,
} as const satisfies MapPoint

export const mapContainerClassName = 'z-0 h-64 w-full'

export type MapMarker = Omit<PlaceMarkerProps, 'size'> & {
  size?: PlaceMarkerProps['size'] | 'sm-dynamic'
} & {
  zIndexOffset?: number
} & {
  placeId?: number
  location: MapPoint
  url?: string
}

export const MapRaw: FC<{
  center?: MapPoint
  className?: string
  zoom?: number
  fullControl?: boolean
  markers?: MapMarker[]
  classNames?: {
    controls?: string
  }
  disableMarkers?: boolean
  onValueChange?: (location: MapPoint | undefined) => void
  value?: MapPoint
  defaultLayer?: LayerId
  innerRef?: (instance: LeafletMap | null) => void
}> = ({
  center = DEFAULT_CENTER,
  className,
  markers,
  fullControl,
  zoom: initialZoom = 14,
  classNames = {},
  disableMarkers,
  onValueChange,
  value,
  defaultLayer,
  innerRef,
}) => {
  const router = useRouter()
  const [map, setMap] = useState<LeafletMap | null>(null)

  useMapResize(map)

  const { zoom } = useMapControlledZoom(map, initialZoom)

  if (onValueChange) {
    map?.addEventListener('click', (e) => {
      onValueChange(e.latlng)
    })
  }

  function calcSize(size: MapMarker['size']) {
    if (!size) {
      if (zoom <= 14) return 'xs'
      if (zoom <= 15) return 'sm'
      return 'md'
    }
    if (size === 'sm-dynamic') {
      if (zoom <= 15.5) return 'none'
      if (zoom <= 16) return 'xs'
      return zoom >= 17 ? 'md' : 'sm'
    }
    return size
  }

  return (
    <MapContainer
      center={value ?? center}
      zoom={zoom}
      zoomControl={false}
      scrollWheelZoom={fullControl}
      doubleClickZoom={fullControl}
      touchZoom={fullControl}
      dragging={fullControl}
      keyboard={fullControl}
      className={cn(mapContainerClassName, className)}
      ref={(value) => {
        innerRef?.(value)
        setMap(value)
      }}
      attributionControl={false}
      zoomSnap={0.5}
      rotate={fullControl}
      touchRotate={fullControl}
    >
      {markers?.map(
        ({
          placeId,
          location,
          url: markerUrl,
          size,
          zIndexOffset,
          showName,
          ...placeMarkerProps
        }) => (
          <Marker
            zIndexOffset={zIndexOffset ?? 0}
            key={`${location.lat}-${location.lng}-${placeId}`}
            position={location}
            interactive={!disableMarkers}
            icon={divIcon({
              html: renderToStaticMarkup(
                <PlaceMarker
                  {...placeMarkerProps}
                  size={calcSize(size)}
                  isDisabled={disableMarkers}
                  showName={zoom >= 16 && showName}
                />
              ),
              iconSize: [0, 0],
              className:
                '!flex justify-center items-center border-0 bg-none [&>*]:shrink-0',
            })}
            eventHandlers={
              markerUrl && !disableMarkers
                ? {
                    click: () => {
                      router.push(markerUrl)
                    },
                  }
                : undefined
            }
            keyboard={fullControl && !disableMarkers}
          />
        )
      )}

      {value && (
        <Marker
          position={value}
          interactive={false}
          key={`${value.lat}-${value.lng}-selected`}
          icon={divIcon({
            html: renderToStaticMarkup(
              <div className="relative">
                <IconFocus2
                  className="absolute inset-0 !-z-10 text-black/60"
                  size={48}
                  stroke={4}
                />
                <IconFocus2 className="z-10 text-white" size={48} stroke={1} />
              </div>
            ),
            iconSize: [0, 0],
            className:
              '!flex justify-center items-center border-0 bg-none [&>*]:shrink-0',
          })}
        />
      )}

      <div
        className={cn(
          'absolute bottom-4 right-4 z-[1000] flex flex-col-reverse gap-2',
          classNames.controls
        )}
      >
        <CustomLayersControl hide={!fullControl} defaultLayer={defaultLayer} />
        <CustomLocationControl hide={!fullControl} />
        <CustomRotationControl hide={!fullControl} />
      </div>
    </MapContainer>
  )
}
