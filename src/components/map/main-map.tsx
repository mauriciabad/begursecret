'use client'

import moize from 'moize'
import { FC, memo } from 'react'
import { cn } from '~/helpers/cn'
import { MapPoint } from '~/helpers/spatial-data/point'
import { useMainMap } from '../providers/main-map-provider'
import { useMapResize } from './hooks/useMapResize'
import { useObserveZoom } from './hooks/useObserveZoom'
import { NextMapContainer } from './leaflet-components/next-js-ready/map-container'
import { CustomLayersControl } from './map-elements/custom-layers-controls'
import { CustomLocationControl } from './map-elements/custom-location-control'
import { MapLine } from './map-elements/map-line'
import { MapMarker } from './map-elements/map-marker'

const DEFAULT_CENTER = {
  lat: 41.953,
  lng: 3.2137,
} as const satisfies MapPoint

const INITIAL_ZOOM = 14

const calcSize = moize(
  (
    size: MapMarker['size'] | 'not-emphasized' | 'all-markers',
    zoom: number
  ) => {
    switch (size) {
      case 'all-markers': {
        if (zoom <= 14) return 'xs'
        if (zoom <= 15) return 'sm'
        return 'md'
      }
      case 'not-emphasized': {
        if (zoom <= 15.5) return 'none'
        if (zoom <= 16) return 'xs'
        if (zoom <= 17) return 'sm'
        return 'md'
      }
      default: {
        return size
      }
    }
  }
)

export const MainMap: FC<{
  className?: string
  classNames?: {
    controls?: string
  }
}> = memo(({ className, classNames = {} }) => {
  const { map, setMap } = useMainMap()

  useMapResize(map)

  return (
    <NextMapContainer
      center={DEFAULT_CENTER}
      zoom={INITIAL_ZOOM}
      zoomControl={false}
      scrollWheelZoom
      doubleClickZoom
      touchZoom
      doubleTouchDragZoom
      dragging
      keyboard
      className={cn('z-0 h-64 w-full', className)}
      ref={setMap}
      attributionControl={false}
      zoomSnap={0.5}
    >
      <LinesLayer />
      <MarkersLayer fullControl />

      <div
        className={cn(
          'absolute bottom-4 right-4 z-[1000] flex flex-col-reverse gap-2',
          classNames.controls
        )}
      >
        <CustomLayersControl />
        <CustomLocationControl />
      </div>
    </NextMapContainer>
  )
})

const MarkersLayer: FC<{
  disableMarkers?: boolean
  fullControl?: boolean
}> = memo(() => {
  const { map, markers, emphasizedMarkers, veryEmphasizedMarkers } =
    useMainMap()

  const { zoom } = useObserveZoom(map, INITIAL_ZOOM)

  const displayMarkers = markers?.map((marker) => {
    if (veryEmphasizedMarkers) {
      if (veryEmphasizedMarkers.has(marker.placeId)) {
        return {
          ...marker,
          animated: true,
          zIndexOffset: 2000,
          size: calcSize('md', zoom),
        }
      } else {
        return {
          ...marker,
          size: calcSize('all-markers', zoom),
          zIndexOffset: 0,
        }
      }
    }

    if (emphasizedMarkers) {
      if (emphasizedMarkers.has(marker.placeId)) {
        return {
          ...marker,
          size: calcSize('md', zoom),
          animated: true,
          zIndexOffset: 1000,
        }
      } else {
        return {
          ...marker,
          size: calcSize('not-emphasized', zoom),
          zIndexOffset: 0,
        }
      }
    }

    return {
      ...marker,
      size: calcSize('all-markers', zoom),
      zIndexOffset: 0,
    }
  })

  return (
    <>
      {displayMarkers.map((mapMarkerProps) => (
        <MapMarker
          key={`${mapMarkerProps.lat}-${mapMarkerProps.lng}-${mapMarkerProps.placeId}`}
          {...mapMarkerProps}
        />
      ))}
    </>
  )
})

const LinesLayer: FC = memo(() => {
  const { lines, veryEmphasizedLines } = useMainMap()

  return (
    <>
      {lines.map((line) => (
        <MapLine
          key={line.routeId}
          {...line}
          veryEmphasized={veryEmphasizedLines?.has(line.routeId)}
        />
      ))}
    </>
  )
})
