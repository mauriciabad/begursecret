'use client'

import { FC, useEffect } from 'react'
import type { MapPoint } from '~/helpers/spatial-data'
import { useMainMap } from './main-map'

export type OverrideMainMapProps = {
  center?: MapPoint
  zoom?: number
  emphasizedPlaces?: Set<number>
  veryEmphasizedPlaces?: Set<number>
}

export const OverrideMainMap: FC<OverrideMainMapProps> = ({
  center,
  zoom,
  emphasizedPlaces,
  veryEmphasizedPlaces,
}) => {
  const { map, originalMarkers, setMarkers } = useMainMap()

  if (map) {
    if (center && center) {
      map.setView(center, zoom)
    } else {
      if (center) {
        map.setView(center)
      }
      if (zoom) {
        map.setZoom(zoom)
      }
    }
  }

  useEffect(() => {
    let newMarkers = originalMarkers

    if (emphasizedPlaces) {
      newMarkers = newMarkers.map((marker) => {
        const isEmphasized =
          marker.placeId && emphasizedPlaces.has(marker.placeId)
        return {
          ...marker,
          size: isEmphasized ? 'normal' : 'tiny',
          zIndexOffset: isEmphasized ? 1000 : 0,
          showName: !!isEmphasized,
        }
      })
    }

    if (veryEmphasizedPlaces) {
      newMarkers = newMarkers.map((marker) => {
        const isVeryEmphasized =
          marker.placeId && veryEmphasizedPlaces.has(marker.placeId)
        return {
          ...marker,
          ...(isVeryEmphasized && {
            animated: true,
            zIndexOffset: 2000,
            size: 'normal',
            showName: true,
          }),
        }
      })
    }

    setMarkers(newMarkers)

    return () => {
      setMarkers(originalMarkers)
    }
  }, [emphasizedPlaces, veryEmphasizedPlaces, originalMarkers, setMarkers])

  return null
}
