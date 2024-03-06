'use client'

import { Card, CardBody, cn } from '@nextui-org/react'
import { FC } from 'react'
import { OptimizedImage } from '~/components/generic/optimized-image'
import { Link } from '~/navigation'
import { ItemOfCategory } from './list-items-of-category'

export const ListItemsOfCategoryItem: FC<{
  item: ItemOfCategory
  type: 'place' | 'route'
}> = ({ item, type }) => {
  return (
    <Card
      as={Link}
      role="link"
      shadow="none"
      radius="lg"
      isPressable
      href={
        type === 'place'
          ? `/explore/places/${item.id}`
          : `/explore/routes/${item.id}`
      }
      className="shrink-0"
    >
      <CardBody
        className={cn(
          'w-[calc(50vw-2rem)] min-w-32 max-w-72',
          'flex flex-col items-center justify-center gap-2 px-2 pt-2'
        )}
      >
        <OptimizedImage
          radius="lg"
          shadow="none"
          className="z-0 aspect-[4/3] h-full border border-stone-100 object-cover"
          image={item.mainImage}
          alt={item.name}
        />
        <span className="line-clamp-3 grow pb-1 text-center font-medium leading-4 text-stone-900">
          {item.name}
        </span>
      </CardBody>
    </Card>
  )
}
