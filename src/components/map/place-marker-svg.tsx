import type { DivIconOptions, IconOptions } from 'leaflet'
import moize from 'moize'
import { FC, ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { cn } from '~/helpers/cn'
import { colorClasses, colorValues } from '~/helpers/color-classes'
import { ColorName, IconName } from '~/server/db/constants/shared'
import { CategoryIcon } from '../icons/category-icon'

const iconVariants = {
  none: {
    size: 0,
    component: () => (
      <svg
        width="0"
        height="0"
        viewBox="0 0 0 0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      ></svg>
    ),
  },
  xs: {
    size: 8,
    component: ({ color = 'gray' }) => (
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="4"
          cy="4"
          r="3.5"
          fill={colorValues['500'][color]}
          stroke="#fff"
          strokeWidth="1"
        />
      </svg>
    ),
  },
  sm: {
    size: 12,
    component: ({ color = 'gray' }) => (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="6"
          cy="6"
          r="5.5"
          fill={colorValues['500'][color]}
          stroke="#fff"
          strokeWidth="1"
        />
      </svg>
    ),
  },
  md: {
    size: 26,
    component: ({ icon, color = 'gray' }) => (
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="13"
          cy="13"
          r="12.5"
          fill={colorValues['500'][color]}
          stroke={colorValues['800'][color]}
          strokeWidth="1"
        />
        <CategoryIcon
          icon={icon}
          color="#fff"
          x="4"
          y="4"
          size="18"
          stroke="2"
        />
      </svg>
    ),
  },
} as const satisfies Record<
  string,
  {
    size: number
    component: FC<{
      icon?: IconName
      color?: ColorName
    }>
  }
>
type PlaceMarkerIconSvgSize = keyof typeof iconVariants

const getPlaceMarkerSvg = moize(
  ({
    icon,
    color,
    size,
  }: {
    icon?: IconName
    color?: ColorName
    size: PlaceMarkerIconSvgSize
  }) => {
    const variant = iconVariants[size]
    return encodeSvg(<variant.component color={color} icon={icon} />)
  }
)

function encodeSvg(reactElement: ReactElement) {
  return `data:image/svg+xml;base64,${btoa(renderToStaticMarkup(reactElement))}` as const
}

export type PlaceMarkerLeafletIconProps = {
  icon?: IconName
  color?: ColorName
  size?: PlaceMarkerIconSvgSize
  animated?: boolean
}

export const getPlaceMarkerLeafletIcon = moize(
  ({ icon, color, size = 'none' }: PlaceMarkerLeafletIconProps) => {
    const svg = getPlaceMarkerSvg({ icon, color, size })
    const variant = iconVariants[size]

    return {
      iconUrl: svg,
      iconRetinaUrl: svg,

      iconSize: [variant.size, variant.size],
      iconAnchor: [variant.size / 2, variant.size / 2],
      popupAnchor: [variant.size / 2, 0],
      tooltipAnchor: [variant.size / 2, 0],
    } satisfies IconOptions
  }
)

export const getPlaceMarkerLeafletDivIcon = moize(
  ({ icon, color = 'gray', size = 'none' }: PlaceMarkerLeafletIconProps) => {
    const svg = getPlaceMarkerSvg({ icon, color, size })
    const variant = iconVariants[size]

    return {
      html: `<img src="${svg}" width="${variant.size}" height="${variant.size}" />`,
      className: cn(
        'before:absolute before:inset-0 before:-z-10 before:animate-ping before:rounded-full',
        colorClasses.beforeBg[color]
      ),

      iconSize: [variant.size, variant.size],
      iconAnchor: [variant.size / 2, variant.size / 2],
      popupAnchor: [variant.size / 2, 0],
      tooltipAnchor: [variant.size / 2, 0],
    } satisfies DivIconOptions
  }
)
