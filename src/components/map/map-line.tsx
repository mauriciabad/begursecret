import { FC } from 'react'
import { Polyline } from 'react-leaflet'
import { colorValues } from '~/helpers/color-classes'
import { MapMultiLine } from '~/helpers/spatial-data/multi-line'
import { useRouter } from '~/navigation'
import { ColorName } from '~/server/db/constants/shared'

const STROKE_WIDTH = 4
const STROKE_BORDER = 2

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

  return (
    <>
      {path.map((line) => (
        <Polyline
          key={`${line.map(([lat, lng]) => `${lat}-${lng}`).join(',')}-bg`}
          positions={line}
          color={colorValues[800][routeMarkerProps.color]}
          weight={STROKE_WIDTH + STROKE_BORDER}
        />
      ))}
      {path.map((line) => (
        <Polyline
          key={line.map(([lat, lng]) => `${lat}-${lng}`).join(',')}
          positions={line}
          color={colorValues[500][routeMarkerProps.color]}
          weight={STROKE_WIDTH}
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
      ))}
    </>
  )
}
