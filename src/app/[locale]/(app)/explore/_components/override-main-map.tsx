'use client'

import { FC, memo, useEffect } from 'react'
import {
  SetOfLines,
  SetOfMarkers,
  useMainMap,
} from '~/components/providers/main-map-provider'
import type { MapPoint } from '~/helpers/spatial-data/point'

export type OverrideMainMapProps = {
  center?: MapPoint
  zoom?: number
  emphasizedMarkers?: SetOfMarkers
  veryEmphasizedMarkers?: SetOfMarkers
  veryEmphasizedLines?: SetOfLines
  reset?: boolean
}

export const OverrideMainMap: FC<OverrideMainMapProps> = memo(
  ({
    center,
    zoom,
    emphasizedMarkers,
    veryEmphasizedMarkers,
    veryEmphasizedLines,
    reset,
  }) => {
    const {
      map,
      setEmphasizedMarkers,
      setVeryEmphasizedMarkers,
      setVeryEmphasizedLines,
    } = useMainMap()

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

        if (reset) {
          setEmphasizedMarkers(new Set())
          setVeryEmphasizedMarkers(new Set())
          setVeryEmphasizedLines(new Set())
        }

        setEmphasizedMarkers(emphasizedMarkers)
        setVeryEmphasizedMarkers(veryEmphasizedMarkers)
        setVeryEmphasizedLines(veryEmphasizedLines)
      }
    }, [map])

    return null
  }
)
