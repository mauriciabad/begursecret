import { FC, memo } from 'react'
import { colorValues } from '~/helpers/color-classes'
import { MapMultiLine } from '~/helpers/spatial-data/multi-line'
import { useRouter } from '~/navigation'
import { ColorName } from '~/server/db/constants/shared'
import { NextPolyline } from '../leaflet-components/next-js-ready/simple-components'

const STROKE_WIDTH = 4
const STROKE_BORDER = 2
const STROKE_OUTLINE = 4

export type MapLineInvariable = {
  routeId: number
  path: MapMultiLine
  url?: string
  color: ColorName
}
export type MapLine = MapLineInvariable & {
  disabled?: boolean
  veryEmphasized?: boolean
}

export const MapLine: FC<MapLine> = memo(
  ({ path, url, disabled, veryEmphasized, ...routeMarkerProps }) => {
    const router = useRouter()

    const extraStrokeWidth = veryEmphasized ? 2 : 0

    const displayLines = (
      <>
        {path.map((line) => (
          <NextPolyline
            key={`${line.map(([lat, lng]) => `${lat}-${lng}`).join(',')}-border`}
            positions={line}
            color={colorValues[800][routeMarkerProps.color]}
            weight={STROKE_WIDTH + extraStrokeWidth + STROKE_BORDER}
          />
        ))}
        {path.map((line) => (
          <NextPolyline
            key={`${line.map(([lat, lng]) => `${lat}-${lng}`).join(',')}-stroke`}
            positions={line}
            color={colorValues[500][routeMarkerProps.color]}
            weight={STROKE_WIDTH + extraStrokeWidth}
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

    return (
      <>
        {veryEmphasized ? (
          <>
            {path.map((line) => (
              <NextPolyline
                key={`${line.map(([lat, lng]) => `${lat}-${lng}`).join(',')}-outline`}
                positions={line}
                color="#fff"
                weight={
                  STROKE_WIDTH +
                  extraStrokeWidth +
                  STROKE_BORDER +
                  STROKE_OUTLINE
                }
              />
            ))}
            {displayLines}
          </>
        ) : (
          displayLines
        )}
      </>
    )
  }
)
