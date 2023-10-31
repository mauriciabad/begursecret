'use client'

import { Card, CardBody } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { LatLngLiteral } from 'leaflet'
import type { FC } from 'react'

function makeImageUrl<T extends string>(s3key: T | null) {
  if (!s3key) {
    return 'https://descobreix-begur-app-g3qf4o.s3.eu-west-1.amazonaws.com/static/app/content-placeholder.png'
  }
  return `https://descobreix-begur-app-g3qf4o.s3.eu-west-1.amazonaws.com/${s3key}` as const
}

export const PlaceList: FC<{
  places: {
    id: number
    mainImage: string | null
    location: LatLngLiteral
    name: string
  }[]
}> = ({ places }) => {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {places?.map((place) => (
        <Card
          as="li"
          shadow="sm"
          key={place.id}
          isPressable
          onPress={() => console.log('item pressed')}
        >
          <CardBody className="">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={place.name}
              className="aspect-square w-full object-cover"
              src={makeImageUrl(place.mainImage)}
            />
            <p className="mt-4 font-bold">{place.name}</p>
          </CardBody>
        </Card>
      ))}
    </ul>
  )
}
