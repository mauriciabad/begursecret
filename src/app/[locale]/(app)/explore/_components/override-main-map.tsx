'use client'

import { FC, memo, useEffect } from 'react'
import {
  SetOfMarkers,
  useMainMap,
} from '~/components/providers/main-map-provider'
import type { MapPoint } from '~/helpers/spatial-data'

export type OverrideMainMapProps = {
  center?: MapPoint
  zoom?: number
  emphasizedMarkers?: SetOfMarkers
  veryEmphasizedMarkers?: SetOfMarkers
}

export const OverrideMainMap: FC<OverrideMainMapProps> = memo(
  ({ center, zoom, emphasizedMarkers, veryEmphasizedMarkers }) => {
    const { map, setEmphasizedMarkers, setVeryEmphasizedMarkers } = useMainMap()

    useEffect(() => {
      if (map) {
        if (center && zoom) {
          map.setView(center, zoom)
        } else {
          if (center) {
            map.setView(center)
          }
          if (zoom) {
            map.setZoom(zoom)
          }
        }

        setEmphasizedMarkers(emphasizedMarkers)

        setVeryEmphasizedMarkers(veryEmphasizedMarkers)
      }
    }, [map])

    return null
  }
)
