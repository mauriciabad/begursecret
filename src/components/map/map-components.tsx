import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'
import { ComponentProps, forwardRef } from 'react'

export const LazyMapContainer = dynamic(
  () => import('./map-lazy-components').then((m) => m.MapContainer),
  {
    ssr: false,
    loading: () => <div style={{ height: '400px' }} />,
  }
)
export const MapContainer = forwardRef<
  LeafletMap,
  ComponentProps<typeof LazyMapContainer>
>((props, ref) => <LazyMapContainer {...props} forwardedRef={ref} />)

const LazyMarker = dynamic(
  () => import('./map-lazy-components').then((m) => m.Marker),
  { ssr: false }
)
export const Marker = forwardRef<
  LeafletMarker,
  ComponentProps<typeof LazyMarker>
>((props, ref) => <LazyMarker {...props} forwardedRef={ref} />)

export const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
)
export const Polyline = dynamic(
  () => import('react-leaflet').then((m) => m.Polyline),
  { ssr: false }
)
