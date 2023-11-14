'use client'

import { FC, useEffect } from 'react'
import { MapPoint } from '~/helpers/spatial-data'
import { useMainMap } from './main-map'

export type OverrideMainMapProps = {
  center?: MapPoint
  zoom?: number
  emphasizedPlaces?: Set<number>
}

export const OverrideMainMap: FC<OverrideMainMapProps> = ({
  center,
  zoom,
  emphasizedPlaces,
}) => {
  const { map, originalMarkers, setMarkers } = useMainMap()

  if (map) {
    if (center && center) {
      map.setView(center, zoom)
    } else {
      if (center) {
        map.setView(center, zoom)
      }
      if (zoom) {
        map.setZoom(zoom)
      }
    }
  }

  useEffect(() => {
    setMarkers(
      emphasizedPlaces
        ? originalMarkers.map((marker) => {
            const isEmphasized =
              marker.placeId && emphasizedPlaces.has(marker.placeId)
            return {
              ...marker,
              size: isEmphasized ? 'normal' : 'tiny',
              zIndexOffset: isEmphasized ? 1000 : 0,
            }
          })
        : originalMarkers
    )

    return () => {
      setMarkers(originalMarkers)
    }
  }, [emphasizedPlaces, originalMarkers])

  return null
}
