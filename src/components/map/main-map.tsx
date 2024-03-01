'use client'

import { Spinner } from '@nextui-org/react'
import { FC, memo } from 'react'
import { cn } from '~/helpers/cn'
import { MapPoint } from '~/helpers/spatial-data/point'
import {
  SetOfLines,
  SetOfMarkers,
  useMainMap,
} from '../providers/main-map-provider'
import { useMapResize } from './hooks/useMapResize'
import { NextMapContainer } from './leaflet-components/next-js-ready/map-container'
import { CustomLayersControl } from './map-elements/custom-layers-controls'
import { CustomLocationControl } from './map-elements/custom-location-control'
import { MapLine, MapLineInvariable } from './map-elements/map-line'
import { MapMarker, MapMarkerInvariable } from './map-elements/map-marker'

const DEFAULT_CENTER = {
  lat: 41.953,
  lng: 3.2137,
} as const satisfies MapPoint

const INITIAL_ZOOM = 14

export const MainMap: FC<{
  className?: string
  classNames?: {
    controls?: string
  }
}> = memo(({ className, classNames = {} }) => {
  const {
    map,
    setMap,
    markers,
    emphasizedMarkers,
    veryEmphasizedMarkers,
    lines,
    veryEmphasizedLines,
  } = useMainMap()

  useMapResize(map)

  const isLoading = !map || !markers || !lines

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
      {lines && (
        <LinesLayer lines={lines} veryEmphasizedLines={veryEmphasizedLines} />
      )}
      {markers && (
        <MarkersLayer
          markers={markers}
          emphasizedMarkers={emphasizedMarkers}
          veryEmphasizedMarkers={veryEmphasizedMarkers}
        />
      )}

      {isLoading && (
        <div className="flex h-full flex-col items-center justify-center">
          <Spinner />
        </div>
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
    </NextMapContainer>
  )
})

const MarkersLayer: FC<{
  markers: readonly MapMarkerInvariable[]
  emphasizedMarkers?: SetOfMarkers
  veryEmphasizedMarkers?: SetOfMarkers
}> = memo(({ markers, emphasizedMarkers, veryEmphasizedMarkers }) => {
  const displayMarkers = markers?.map((marker) => {
    if (veryEmphasizedMarkers) {
      if (veryEmphasizedMarkers.has(marker.placeId)) {
        return {
          ...marker,
          animated: true,
          zIndexOffset: 2000,
          size: 'md',
        } as const
      } else {
        return {
          ...marker,
          size: 'all-markers',
          zIndexOffset: 0,
        } as const
      }
    }

    if (emphasizedMarkers) {
      if (emphasizedMarkers.has(marker.placeId)) {
        return {
          ...marker,
          size: 'md',
          animated: true,
          zIndexOffset: 1000,
        } as const
      } else {
        return {
          ...marker,
          size: 'not-emphasized',
          zIndexOffset: 0,
        } as const
      }
    }

    return {
      ...marker,
      size: 'all-markers',
      zIndexOffset: 0,
    } as const
  })

  return (
    <>
      {displayMarkers?.map((mapMarkerProps) => (
        <MapMarker
          key={`${mapMarkerProps.lat}-${mapMarkerProps.lng}-${mapMarkerProps.placeId}`}
          {...mapMarkerProps}
        />
      ))}
    </>
  )
})

const LinesLayer: FC<{
  lines: readonly MapLineInvariable[]
  veryEmphasizedLines?: SetOfLines
}> = memo(({ lines, veryEmphasizedLines }) => {
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
