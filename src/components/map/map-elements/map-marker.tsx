import { FC } from 'react'
import { MapPoint } from '~/helpers/spatial-data/point'
import { useRouter } from '~/navigation'
import { NextMarker } from '../leaflet-components/next-js-ready/marker'
import {
  PlaceMarkerLeafletIconProps,
  getPlaceMarkerLeafletDivIcon,
  getPlaceMarkerLeafletIcon,
} from '../utilities/place-marker-svg'

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

  const iconOptions = placeMarkerProps.animated
    ? getPlaceMarkerLeafletDivIcon(placeMarkerProps)
    : getPlaceMarkerLeafletIcon(placeMarkerProps)

  return (
    <NextMarker
      zIndexOffset={zIndexOffset ?? 0}
      position={[lat, lng]}
      interactive={!disabled}
      icon={iconOptions}
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
