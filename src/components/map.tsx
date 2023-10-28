import dynamic from 'next/dynamic'
import { IconLoader } from '@tabler/icons-react'

export const Map = dynamic(
  () => import('./map-raw').then((mod) => mod.MapRaw),
  {
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#f2efe9]">
        <IconLoader className="mr-1 h-4 w-4 animate-spin" />
        <span className="animate-pulse">Loading map...</span>
      </div>
    ),
    ssr: false,
  }
)
