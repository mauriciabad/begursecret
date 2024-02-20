import { FC } from 'react'
import { Marker } from 'react-leaflet'
import { MapPoint } from '~/helpers/spatial-data'
import { useRouter } from '~/navigation'
import {
  PlaceMarkerLeafletIconProps,
  getPlaceMarkerLeafletIcon,
} from './place-marker-svg'

export type MapMarkerInvariable = {
  placeId: number
  lat: MapPoint['lat']
  lng: MapPoint['lng']
  url?: string
  icon: PlaceMarkerLeafletIconProps['icon']
  color: PlaceMarkerLeafletIconProps['color']
}
export type MapMarker = MapMarkerInvariable & {
  zIndexOffset?: number
  disabled?: boolean
  animated?: boolean
  size?: PlaceMarkerLeafletIconProps['size']
}

export const MapMarker: FC<MapMarker> = ({
  lat,
  lng,
  url,
  zIndexOffset,
  disabled,
  ...placeMarkerProps
}) => {
  const router = useRouter()

  return (
    <Marker
      zIndexOffset={zIndexOffset ?? 0}
      position={[lat, lng]}
      interactive={!disabled}
      icon={getPlaceMarkerLeafletIcon(placeMarkerProps)}
      eventHandlers={
        url && !disabled
          ? {
              click: () => {
                router.push(url)
              },
            }
          : undefined
      }
      keyboard={!disabled}
    />
  )
}
