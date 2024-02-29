import dynamic from 'next/dynamic'

export const NextTileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
)
export const NextPolyline = dynamic(
  () => import('react-leaflet').then((m) => m.Polyline),
  { ssr: false }
)
