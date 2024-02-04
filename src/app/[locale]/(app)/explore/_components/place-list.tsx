'use client'

import { Card, CardBody } from '@nextui-org/card'
import Link from 'next-intl/link'
import { FC } from 'react'
import { OptimizedImage } from '~/components/generic/optimized-image'
import { ApiRouterOutput } from '~/server/api/router'
import { PlaceCategoryTagList } from '../../../../../components/place-category-tags/place-category-tag-list'

type Places =
  | ApiRouterOutput['places']['search']
  | ApiRouterOutput['placeLists']['getVisitedPlaces']

export const PlaceList: FC<{
  places: Places
}> = ({ places }) => {
  return (
    <ul className="py-2">
      {places?.map((place) => (
        <li key={place.id}>
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
                  wrap
                  className="mt-2"
                />

                {place.description && (
                  <p className="text-stone-800">{place.description}</p>
                )}
              </div>
              <OptimizedImage
                radius="md"
                alt={place.name}
                className="z-0 aspect-[4/3] h-16 object-cover"
                image={{
                  key: place.mainImage,
                  width: 123,
                  height: 123,
                }}
              />
            </CardBody>
          </Card>
        </li>
      ))}
    </ul>
  )
}
