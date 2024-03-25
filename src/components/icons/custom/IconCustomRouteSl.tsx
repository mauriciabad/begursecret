import { Icon } from '@tabler/icons-react'

export const IconCustomRouteSl: Icon = ({ size, stroke, ...svgProps }) => {
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
        d="M14 5V13H18"
        stroke="currentColor"
        stroke-width={svgStroke}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6 12C6 12.2652 6.10536 12.5196 6.29289 12.7071C6.48043 12.8946 6.73478 13 7 13H9C9.26522 13 9.51957 12.8946 9.70711 12.7071C9.89464 12.5196 10 12.2652 10 12V10C10 9.73478 9.89464 9.48043 9.70711 9.29289C9.51957 9.10536 9.26522 9 9 9H7C6.73478 9 6.48043 8.89464 6.29289 8.70711C6.10536 8.51957 6 8.26522 6 8V6C6 5.73478 6.10536 5.48043 6.29289 5.29289C6.48043 5.10536 6.73478 5 7 5H9C9.26522 5 9.51957 5.10536 9.70711 5.29289C9.89464 5.48043 10 5.73478 10 6"
        stroke="currentColor"
        stroke-width={svgStroke}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
