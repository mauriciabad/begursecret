'use client'

import { Card, CardBody } from '@nextui-org/card'
import { IconMapPinOff } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { CategoryTagList } from '~/components/category-tags/category-tag-list'
import { OptimizedImage } from '~/components/generic/optimized-image'
import { Link } from '~/navigation'
import { ApiRouterOutput } from '~/server/api/router'

type Places =
  | ApiRouterOutput['places']['search']
  | ApiRouterOutput['placeLists']['getVisitedPlaces']

export const PlaceList: FC<{
  places: Places
}> = ({ places }) => {
  const t = useTranslations('explore')

  if (!places || places.length === 0) {
    return (
      <div className="space-y-1 pt-8">
        <IconMapPinOff
          size={48}
          stroke={1}
          className="mx-auto text-stone-500"
        />
        <p className="text-center">{t('no-places')}</p>
      </div>
    )
  }

  return (
    <ul className="py-2">
      {places.map((place) => (
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

                <CategoryTagList
                  mainCategory={place.mainCategory}
                  categories={place.categories.map((c) => c.category)}
                  wrap
                  className="mt-2"
                />

                {place.description && (
                  <p className="text-stone-800">{place.description}</p>
                )}
              </div>
              {place.mainImage && (
                <OptimizedImage
                  radius="md"
                  alt={place.name}
                  className="z-0 aspect-[4/3] h-16 w-auto object-cover"
                  image={place.mainImage}
                />
              )}
            </CardBody>
          </Card>
        </li>
      ))}
    </ul>
  )
}
