import { Icon } from '@tabler/icons-react'

export const IconCustomRouteGr: Icon = ({ size, stroke, ...svgProps }) => {
  const svgStroke = stroke ?? 2
  const svgSize = size ?? 24
  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <path
        d="M5 18H7M11 18H13M17 18H19"
        stroke="currentColor"
        stroke-width={svgStroke}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14 13V9M14 9H16.667C17.403 9 18 8.105 18 7C18 5.895 17.403 5 16.667 5H14V9ZM14 9H15.3333L18 13"
        stroke="currentColor"
        stroke-width={svgStroke}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 5H8C7.46957 5 6.96086 5.21071 6.58579 5.58579C6.21071 5.96086 6 6.46957 6 7V11C6 11.5304 6.21071 12.0391 6.58579 12.4142C6.96086 12.7893 7.46957 13 8 13H10V9H9"
        stroke="currentColor"
        stroke-width={svgStroke}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
