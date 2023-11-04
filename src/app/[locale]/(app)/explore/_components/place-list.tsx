'use client'

import { Card, CardBody } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import Link from 'next-intl/link'
import { FC } from 'react'
import { makeImageUrl } from '~/helpers/images'
import { MapPoint } from '~/helpers/spatial-data'

import { PlaceCategoryIcon as PlaceCategoryIconType } from '~/server/db/constants/places'
import { PlaceCategoryTagList } from './place-category-tag-list'

export const PlaceList: FC<{
  places: {
    id: number
    mainImage: string | null
    location: MapPoint
    name: string
    mainCategory: {
      icon: PlaceCategoryIconType | null
      name: string
    }
    categories: {
      category: { icon: PlaceCategoryIconType | null; name: string }
    }[]
  }[]
}> = ({ places }) => {
  return (
    <ul className="py-2">
      {places?.map((place) => (
        <li>
          <Card
            as={Link}
            shadow="none"
            radius="none"
            key={place.id}
            isPressable
            href={`/explore/places/${place.id}`}
          >
            <CardBody className="grid grid-cols-[1fr_auto] px-4 py-2">
              <div>
                <h2 className="font-title font-bold">{place.name}</h2>

                <PlaceCategoryTagList
                  mainCategory={place.mainCategory}
                  categories={place.categories.map((c) => c.category)}
                />

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
        </li>
      ))}
    </ul>
  )
}
