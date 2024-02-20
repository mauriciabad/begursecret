import { FC } from 'react'
import { Polyline } from 'react-leaflet'
import { MapMultiLine } from '~/helpers/spatial-data/multi-line'
import { useRouter } from '~/navigation'
import { ColorName } from '~/server/db/constants/shared'

export type MapLineInvariable = {
  routeId: number
  path: MapMultiLine
  url?: string
  color: ColorName
}
export type MapLine = MapLineInvariable & {
  disabled?: boolean
}

export const MapLine: FC<MapLine> = ({
  path,
  url,
  disabled,
  ...routeMarkerProps
}) => {
  const router = useRouter()

  return path.map((line) => (
    <Polyline
      key={line.map(([lat, lng]) => `${lat}-${lng}`).join(',')}
      positions={line}
      color={routeMarkerProps.color}
      weight={5}
      eventHandlers={
        url && !disabled
          ? {
              click: () => {
                router.push(url)
              },
            }
          : undefined
      }
    />
  ))
}
