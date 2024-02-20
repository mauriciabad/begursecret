'use client'

import type { Map as LeafletMap } from 'leaflet'
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react'
import { MapLineInvariable } from '../map/map-line'
import { MapMarkerInvariable } from '../map/map-marker'

export type SetOfMarkers = Set<NonNullable<MapMarkerInvariable['placeId']>>

const MainMapCtx = createContext<
  Readonly<{
    map: LeafletMap | null
    setMap: (map: LeafletMap | null) => void
    emphasizedMarkers: SetOfMarkers | undefined
    setEmphasizedMarkers: (markers: SetOfMarkers | undefined) => void
    veryEmphasizedMarkers: SetOfMarkers | undefined
    setVeryEmphasizedMarkers: (markers: SetOfMarkers | undefined) => void
    markers: readonly MapMarkerInvariable[]
    lines: readonly MapLineInvariable[]
  }>
>({
  map: null,
  setMap: () => {},
  emphasizedMarkers: undefined,
  setEmphasizedMarkers: () => {},
  veryEmphasizedMarkers: undefined,
  setVeryEmphasizedMarkers: () => {},
  markers: [],
  lines: [],
})

export const useMainMap = () => useContext(MainMapCtx)

export const MainMapProvider: FC<
  PropsWithChildren<{
    markers: MapMarkerInvariable[]
    lines: MapLineInvariable[]
  }>
> = ({ markers, children, lines }) => {
  const [map, setMap] = useState<LeafletMap | null>(null)
  const [emphasizedMarkers, setEmphasizedMarkers] = useState<SetOfMarkers>()
  const [veryEmphasizedMarkers, setVeryEmphasizedMarkers] =
    useState<SetOfMarkers>()

  return (
    <>
      <MainMapCtx.Provider
        value={{
          map,
          setMap,
          emphasizedMarkers,
          setEmphasizedMarkers,
          veryEmphasizedMarkers,
          setVeryEmphasizedMarkers,
          markers,
          lines,
        }}
      >
        {children}
      </MainMapCtx.Provider>
    </>
  )
}
