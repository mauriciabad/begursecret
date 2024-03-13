import moize from 'moize'
import { FC, memo, useState } from 'react'
import { useMapEvent } from 'react-leaflet'
import { colorValues } from '~/helpers/color-classes'
import { MapMultiLine } from '~/helpers/spatial-data/multi-line'
import { useRouter } from '~/navigation'
import { ColorName } from '~/server/db/constants/shared'
import { NextPolyline } from '../leaflet-components/next-js-ready/simple-components'

const STROKE_WIDTHS = {
  '3xs': 1,
  '2xs': 1,
  xs: 2,
  sm: 3,
  md: 4,
  lg: 6,
} as const satisfies Record<string, number>
type StrokeWidthName = keyof typeof STROKE_WIDTHS

const STROKE_BORDER = 2
const STROKE_OUTLINE = 4

export type MapLineInvariable = {
  routeId: number
  path: MapMultiLine
  url?: string
  color: ColorName
  importance: number | null
}
export type MapLine = MapLineInvariable & {
  disabled?: boolean
  veryEmphasized?: boolean
}

export const MapLine: FC<MapLine> = memo(
  ({ path, url, disabled, veryEmphasized, ...routeMarkerProps }) => {
    const router = useRouter()

    const status = veryEmphasized ? 'emphasized' : 'normal'

    const [actualSize, setActualSize] = useState<StrokeWidthName | 'none'>(
      calcSize(status, routeMarkerProps.importance, 14)
    )

    const map = useMapEvent('zoom', () => {
      const zoom = map.getZoom()
      const newSize = calcSize(status, routeMarkerProps.importance, zoom)
      if (newSize !== actualSize) {
        setActualSize(newSize)
      }
    })

    if (actualSize === 'none') return null

    const displayLines = (
      <>
        {actualSize !== '3xs' &&
          path.map((line) => (
            <NextPolyline
              key={calcKey(line, 'border', actualSize)}
              positions={line}
              color={colorValues[800][routeMarkerProps.color]}
              weight={STROKE_WIDTHS[actualSize] + STROKE_BORDER}
            />
          ))}
        {path.map((line) => (
          <NextPolyline
            key={calcKey(line, 'stroke', actualSize)}
            positions={line}
            color={colorValues[500][routeMarkerProps.color]}
            weight={STROKE_WIDTHS[actualSize]}
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
        {status === 'emphasized' ? (
          <>
            {path.map((line) => (
              <NextPolyline
                key={calcKey(line, 'outline', actualSize)}
                positions={line}
                color="#fff"
                weight={
                  STROKE_WIDTHS[actualSize] + STROKE_BORDER + STROKE_OUTLINE
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

type MapLineSize = 'normal' | 'emphasized'

const MAX_IMPORTANCE = 10

const calcSize = moize(
  (status: MapLineSize, rawImportance: number | null, rawZoom: number) => {
    if (status === 'emphasized') return 'lg'

    const zoom = zoomInRange(rawZoom)
    const importance = Math.floor(
      Math.min(rawImportance ?? MAX_IMPORTANCE, MAX_IMPORTANCE)
    )

    return sizeByImportanceAndZoom[zoom][importance] ?? '3xs'
  }
)

const sizeByImportanceAndZoom = {
  //    0     1     2     3     4     5     6     7     8     9     10
  12: [
    '3xs',
    '3xs',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
  ],
  13: ['xs', '2xs'],
  14: ['sm', 'xs', '2xs'],
  15: ['md', 'sm', 'xs', '2xs'],
  16: ['md', 'md', 'sm', 'xs', '2xs', '2xs'],
  17: ['md', 'md', 'md', 'md', 'sm', 'sm', 'xs', 'xs', '2xs', '2xs'],
  18: ['md', 'md', 'md', 'md', 'md', 'md', 'md', 'md', 'sm', 'xs', 'xs'],
  19: ['md', 'md', 'md', 'md', 'md', 'md', 'md', 'md', 'md', 'md', 'md'],
  20: ['md', 'md', 'md', 'md', 'md', 'md', 'md', 'md', 'md', 'md', 'md'],
} as const satisfies Record<number, (StrokeWidthName | 'none')[]>

const minZoomWithSize = Math.min(
  ...Object.keys(sizeByImportanceAndZoom).map(Number)
) as keyof typeof sizeByImportanceAndZoom

const maxZoomWithSize = Math.max(
  ...Object.keys(sizeByImportanceAndZoom).map(Number)
) as keyof typeof sizeByImportanceAndZoom

function zoomInRange(zoom: number) {
  let result = Math.floor(zoom)
  result = Math.max(result, minZoomWithSize)
  result = Math.min(result, maxZoomWithSize)
  return result as keyof typeof sizeByImportanceAndZoom
}

const calcKey = moize(
  (
    line: MapMultiLine[number],
    type: 'border' | 'stroke' | 'outline' = 'stroke',
    size: StrokeWidthName
  ) => {
    return `${line
      .map(([lat, lng]) => `${lat}-${lng}`)
      .join(',')}-${type}-${size}`
  }
)
