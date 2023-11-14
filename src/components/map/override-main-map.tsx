'use client'

import { FC } from 'react'
import { useMainMap } from '~/app/[locale]/(app)/explore/_components/main-map'
import { MapPoint } from '~/helpers/spatial-data'

export const OverrideMainMap: FC<{
  center?: MapPoint
  zoom?: number
}> = ({ center, zoom }) => {
  const map = useMainMap()

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

  return null
}
