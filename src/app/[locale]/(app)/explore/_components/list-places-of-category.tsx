'use client'

import { Card, CardBody } from '@nextui-org/card'
import { IconChevronRight, IconPlus } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { OptimizedImage } from '~/components/generic/optimized-image'
import { PlaceCategoryIcon } from '~/components/icons/place-category-icon'
import { cn } from '~/helpers/cn'
import { colorClasses } from '~/helpers/colors'
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
        <div className="flex items-center gap-3">
          <div
            className={cn(
              [colorClasses.bg[category.color]],
              'flex items-center justify-center rounded-full p-1.5 text-white'
            )}
          >
            <PlaceCategoryIcon
              icon={category.icon}
              className="block h-6 w-6"
              size={18}
              stroke={1.75}
            />
          </div>
          <h3 className="font-title text-lg font-semibold uppercase leading-none tracking-wide text-stone-900">
            {category.namePlural}
          </h3>
        </div>

        <Link
          href={`/explore/search?category=${category.id}`}
          className="flex items-center gap-1 pl-2"
        >
          <span className="text-right text-sm leading-none text-stone-500">
            {t('see-all', { gender: category.nameGender })}
          </span>
          <IconChevronRight
            size={24}
            stroke={1.5}
            className="-mx-1 align-middle text-stone-400"
          />
        </Link>
      </div>

      <ul className="mt-2 flex items-stretch gap-4 overflow-x-auto px-4">
        {places.map((place) => (
          <li className="contents" key={place.id}>
            <Card
              as={Link}
              role="link"
              shadow="none"
              radius="lg"
              isPressable
              href={`/explore/places/${place.id}`}
              className="shrink-0"
            >
              <CardBody
                className={cn(
                  'w-[calc(50vw-2rem)] min-w-32 max-w-72',
                  'flex flex-col items-center justify-center gap-2 p-0'
                )}
              >
                <OptimizedImage
                  radius="lg"
                  shadow="sm"
                  className="z-0 aspect-[4/3] h-full object-cover"
                  image={place.mainImage}
                  alt={place.name}
                />
                <span className="line-clamp-3 grow pb-1 text-center leading-4 text-stone-900">
                  {place.name}
                </span>
              </CardBody>
            </Card>
          </li>
        ))}
        <li>
          <Link
            href={`/explore/search?category=${category.id}`}
            className={cn(
              'flex h-full w-32 flex-col items-center justify-center gap-2 pb-8'
            )}
          >
            <div className="flex items-center justify-center rounded-full bg-gray-100 p-1">
              <IconPlus size={48} stroke={1} className="text-stone-400" />
            </div>
            <span className="leading-none text-stone-500">
              {t('see-all', { gender: category.nameGender })}
            </span>
          </Link>
        </li>
      </ul>
    </div>
  )
}
