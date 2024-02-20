import { Map } from 'leaflet'
import { useCallback, useEffect, useState } from 'react'

const INCREMENT = 0.5
const round = (value: number) => Math.round(value / INCREMENT) * INCREMENT

export function useObserveZoom(map: Map | null, initialZoom: number) {
  const [zoom, setZoom] = useState<number>(map?.getZoom() ?? initialZoom)

  const onZoom = useCallback(() => {
    if (map) {
      const newZoom = round(map.getZoom())
      if (newZoom !== zoom) setZoom(newZoom)
    }
  }, [map])

  useEffect(() => {
    if (map) {
      map.on('zoom', onZoom)
      return () => {
        map.off('zoom', onZoom)
      }
    }
  }, [map, onZoom])

  return { zoom }
}
