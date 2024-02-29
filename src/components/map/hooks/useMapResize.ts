import type { Map as LeafletMap } from 'leaflet'
import { useEffect } from 'react'

export function useMapResize(map: LeafletMap | null) {
  useEffect(() => {
    if (map) {
      const resizeObserver = new ResizeObserver(() => map.invalidateSize())

      const container = map.getContainer()
      resizeObserver.observe(container)

      return () => {
        resizeObserver.unobserve(container)
      }
    }
  }, [map])

  return {}
}
