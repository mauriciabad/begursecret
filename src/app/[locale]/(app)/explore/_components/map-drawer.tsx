import type { FC, PropsWithChildren } from 'react'

type MapDrawerProps = PropsWithChildren

export const MapDrawer: FC<MapDrawerProps> = ({ children }) => {
  return (
    <div className="bg-[#fefefe]">
      <div className="py-1">
        <div className="mx-auto h-1 w-8 rounded-full bg-stone-300" />
      </div>

      <div className="mx-auto max-w-2xl px-6 py-3">{children}</div>
    </div>
  )
}
