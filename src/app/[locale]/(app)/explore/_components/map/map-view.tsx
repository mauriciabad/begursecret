'use client'

import { LatLngLiteral } from 'leaflet'
import { FC } from 'react'
import { Map } from '~/components/map'

export const MapView: FC<{
  places: {
    id: number
    mainImage: string | null
    location: LatLngLiteral
    name: string
  }[]
}> = ({ places }) => {
  return (
    <Map
      className="grow"
      fullControl
      zoom={14}
      markers={places.map((place) => ({
        text: place.name,
        location: place.location,
        markerType: 'beach',
      }))}
    />
  )
}
