import { Map } from 'leaflet'
import { useCallback, useEffect, useState } from 'react'

export function useMapControlledZoom(map: Map | null, initialZoom: number) {
  const [zoom, setZoom] = useState<number>(initialZoom)

  const onZoom = useCallback(() => {
    if (map) {
      setZoom(map.getZoom())
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

  return { zoom, setZoom }
}
