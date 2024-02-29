import type { Marker as LeafletMarker } from 'leaflet'
import dynamic from 'next/dynamic'
import { ComponentProps, forwardRef } from 'react'

const LazyMarker = dynamic(
  () => import('../to-be-lazy-loaded/marker').then((m) => m.Marker),
  { ssr: false }
)
export const NextMarker = forwardRef<
  LeafletMarker,
  ComponentProps<typeof LazyMarker>
>((props, ref) => <LazyMarker {...props} forwardedRef={ref} />)
