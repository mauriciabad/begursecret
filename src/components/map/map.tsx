import { IconLoader } from '@tabler/icons-react'
import dynamic from 'next/dynamic'

export const Map = dynamic(
  async () => {
    const { MapRaw: Map } = await import('./map-raw')
    return { default: Map }
  },
  {
    loading: () => (
      <div className="flex h-full w-full grow items-center justify-center bg-[#f2efe9]">
        <IconLoader className="mr-1 h-4 w-4 animate-spin" />
        <span className="animate-pulse">Loading map...</span>
      </div>
    ),
    ssr: false,
  }
)
