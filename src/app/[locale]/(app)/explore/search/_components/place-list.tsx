'use client'

import { Card, CardBody } from '@nextui-org/card'
import { IconMapPinOff } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { CategoryTagList } from '~/components/category-tags/category-tag-list'
import { OptimizedImage } from '~/components/generic/optimized-image'
import { Link } from '~/navigation'
import { ApiRouterOutput } from '~/server/api/router'

type BaseItem =
  | ApiRouterOutput['search']['places' | 'routes'][number]
  | ApiRouterOutput['placeLists']['getVisitedPlaces'][number]

export const PlaceList: FC<{
  items: (BaseItem & {
    type: 'place' | 'route'
  })[]
}> = ({ items }) => {
  const t = useTranslations('explore')

  if (!items || items.length === 0) {
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
      {items.map((item) => (
        <li key={item.id}>
          <Card
            as={Link}
            shadow="none"
            radius="none"
            key={item.id}
            isPressable
            href={
              item.type === 'place'
                ? `/explore/places/${item.id}`
                : `/explore/routes/${item.id}`
            }
          >
            <CardBody className="grid grid-cols-[1fr_auto] px-4 py-2">
              <div>
                <h2 className="font-title font-bold">{item.name}</h2>

                <CategoryTagList
                  mainCategory={item.mainCategory}
                  categories={item.categories.map((c) => c.category)}
                  wrap
                  className="mt-2"
                />

                {item.description && (
                  <p className="text-stone-800">{item.description}</p>
                )}
              </div>
              {item.mainImage && (
                <OptimizedImage
                  radius="md"
                  alt={item.name}
                  className="z-0 aspect-[4/3] h-16 w-auto object-cover"
                  image={item.mainImage}
                />
              )}
            </CardBody>
          </Card>
        </li>
      ))}
    </ul>
  )
}
