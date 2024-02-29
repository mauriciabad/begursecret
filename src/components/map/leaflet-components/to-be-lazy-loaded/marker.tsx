import type {
  DivIcon,
  DivIconOptions,
  Icon,
  IconOptions,
  Marker as LeafletMarker,
} from 'leaflet'
import { FC, Ref, useEffect, useState } from 'react'
import { Marker as LMarker, type MarkerProps } from 'react-leaflet'

export const Marker: FC<
  {
    forwardedRef?: Ref<LeafletMarker> | null
  } & Omit<MarkerProps, 'icon'> & {
      icon?: DivIconOptions | IconOptions
    }
> = ({ forwardedRef, icon: iconProps, ...props }) => {
  const [icon, setIcon] = useState<DivIcon | Icon>()

  useEffect(() => {
    ;(async () => {
      const L = (await import('leaflet')).default
      if (!iconProps) return
      setIcon(
        isDivIconOptions(iconProps) ? L.divIcon(iconProps) : L.icon(iconProps)
      )
    })()
  }, [iconProps])

  // waiting for icon to be loaded before rendering
  return !!iconProps && !icon ? null : (
    <LMarker {...props} icon={icon} ref={forwardedRef} />
  )
}
function isDivIconOptions(
  iconProps: DivIconOptions | IconOptions
): iconProps is DivIconOptions {
  return 'html' in iconProps
}
