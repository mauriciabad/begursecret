'use client'

import { Card } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { IconChevronRight } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { FC } from 'react'
import { PlaceCategoryIcon } from '~/components/icons/place-category-icon'
import { makeImageUrl } from '~/helpers/images'
import {
  PlaceCategoryColor,
  PlaceCategoryIcon as PlaceCategoryIconType,
} from '~/server/db/constants/places'

export const ListPlacesOfCategory: FC<{
  category: {
    id: number
    icon: PlaceCategoryIconType | null
    name: string
    namePlural: string
    nameGender: 'masculine' | 'feminine' | null
    color: PlaceCategoryColor
  }
  places: {
    id: number
    name: string
    mainImage: string | null
  }[]
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
      <ul className="flex items-start gap-4 overflow-x-auto overflow-y-visible px-4 py-2 [&>*]:shrink-0">
        {places.map((place) => (
          <li className="contents">
            <Card
              as={Link}
              shadow="none"
              radius="none"
              key={place.id}
              isPressable
              href={`/explore/place/${place.id}`}
              className="flex w-32 flex-col items-center justify-center gap-2 overflow-visible p-0"
            >
              <Image
                radius="lg"
                shadow="sm"
                alt={place.name}
                className="z-0 aspect-[4/3] h-full object-cover"
                src={makeImageUrl(place.mainImage)}
              />
              <span className="line-clamp-3 text-center text-sm font-medium leading-4 text-stone-900">
                {place.name}
              </span>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
