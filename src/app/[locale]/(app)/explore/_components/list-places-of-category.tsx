'use client'

import { Card, CardBody } from '@nextui-org/card'
import { IconChevronRight } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { OptimizedImage } from '~/components/generic/optimized-image'
import { PlaceCategoryIcon } from '~/components/icons/place-category-icon'
import { Link } from '~/navigation'
import { ApiRouterOutput } from '~/server/api/router'

type Category = ApiRouterOutput['places']['listCategories'][number]
type Places = ApiRouterOutput['places']['list']

export const ListPlacesOfCategory: FC<{
  category: Category
  places: Places
}> = ({ category, places }) => {
  const t = useTranslations('explore')
  return (
    <div>
      <div className="flex items-center justify-between px-4">
        <h3 className="flex items-center gap-2">
          <PlaceCategoryIcon
            icon={category.icon}
            className="inline-block h-6 w-6"
          />
          <span className="font-title text-lg font-semibold leading-none text-stone-900">
            {category.namePlural}
          </span>
        </h3>

        <Link
          href={`/explore/search?category=${category.id}`}
          className="flex items-center gap-1 pl-2"
        >
          <span className="text-sm leading-none text-stone-500">
            {t('see-all', { gender: category.nameGender })}
          </span>
          <IconChevronRight
            size={24}
            stroke={1.5}
            className="-mx-1 align-middle text-stone-400"
          />
        </Link>
      </div>

      <ul className="flex items-stretch overflow-x-auto px-2 py-2">
        {places.map((place) => (
          <li className="contents" key={place.id}>
            <Card
              as={Link}
              shadow="none"
              radius="lg"
              isPressable
              href={`/explore/places/${place.id}`}
              className="shrink-0"
            >
              <CardBody className="flex w-32 flex-col items-center justify-center gap-2 p-2">
                <OptimizedImage
                  radius="lg"
                  shadow="sm"
                  className="z-0 aspect-[4/3] h-full object-cover"
                  image={place.mainImage}
                  alt={place.name}
                />
                <span className="line-clamp-3 grow text-center text-sm font-medium leading-4 text-stone-900">
                  {place.name}
                </span>
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
