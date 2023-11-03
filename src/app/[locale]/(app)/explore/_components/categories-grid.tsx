'use client'

import { Card } from '@nextui-org/card'
import Link from 'next-intl/link'
import { FC } from 'react'
import { PlaceCategoryIcon } from '~/components/icons/place-category-icon'
import {
  PlaceCategoryColor,
  PlaceCategoryIcon as PlaceCategoryIconType,
} from '~/server/db/constants/places'

export const CategoriesGrid: FC<{
  categories: {
    id: number
    icon: PlaceCategoryIconType | null
    name: string
    namePlural: string
    color: PlaceCategoryColor
  }[]
}> = ({ categories }) => {
  return (
    <ul className="grid grid-cols-3 gap-2 p-4">
      {categories.map((category) => (
        <li className="contents">
          <Card
            as={Link}
            shadow="none"
            radius="sm"
            key={category.id}
            isPressable
            href={`/explore/search?category=${category.id}`}
            className="flex flex-col items-center justify-center gap-1 border border-stone-100 bg-white p-2"
          >
            <PlaceCategoryIcon
              icon={category.icon}
              size={24}
              className="text-stone-800"
            />
            <span className="line-clamp-3 text-center text-sm font-medium leading-4 text-stone-900">
              {category.namePlural}
            </span>
          </Card>
        </li>
      ))}
    </ul>
  )
}
