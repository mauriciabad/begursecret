'use client'

import { Card, CardBody } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { FC } from 'react'
import { PlaceCategoryIcon } from '~/components/icons/place-category-icon'
import { MapPoint } from '~/helpers/spatial-data'
import { PlaceCategoryIcon as PlaceCategoryIconType } from '~/server/db/constants/places'

function makeImageUrl<T extends string>(s3key: T | null) {
  if (!s3key) {
    return 'https://descobreix-begur-app-g3qf4o.s3.eu-west-1.amazonaws.com/static/app/content-placeholder.png'
  }
  return `https://descobreix-begur-app-g3qf4o.s3.eu-west-1.amazonaws.com/${s3key}` as const
}

export const PlaceDetails: FC<{
  placeFullInfo: {
    id: number
    mainImage: string | null
    location: MapPoint
    name: string
    mainCategory: {
      icon: PlaceCategoryIconType | null
      name: string
    }
  }
}> = ({ placeFullInfo: place }) => {
  return (
    <ul className="py-2">
      <Card shadow="none" radius="none" key={place.id}>
        <CardBody className="grid grid-cols-[1fr_auto] px-4 py-2">
          <div>
            <h2 className="font-title font-bold">{place.name}</h2>
            {place.mainCategory && (
              <p className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-stone-50 px-2 py-1 text-sm leading-none text-stone-500">
                <PlaceCategoryIcon icon={place.mainCategory.icon} size={16} />
                {place.mainCategory.name}
              </p>
            )}
            <p className="text-sm text-gray-500">
              {place.location.lat}, {place.location.lng}
            </p>
          </div>
          <Image
            radius="md"
            alt={place.name}
            className="z-0 aspect-square h-16 object-cover"
            src={makeImageUrl(place.mainImage)}
          />
        </CardBody>
      </Card>
    </ul>
  )
}
