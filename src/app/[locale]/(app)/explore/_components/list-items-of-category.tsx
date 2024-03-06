import { Skeleton } from '@nextui-org/react'
import { IconChevronRight, IconPlus } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { PlaceMarker } from '~/components/generic/place-marker'
import { cn } from '~/helpers/cn'
import { ImageType } from '~/helpers/images'
import { Link } from '~/navigation'
import { PlaceCategory } from '~/server/db/constants/placeCategories'
import { ListItemsOfCategoryItem } from './list-items-of-category-item'

export type ItemOfCategory = {
  id: number
  name: string
  mainImage: ImageType | null
  importance: number | null
}

export const ListItemsOfCategory: FC<{
  category: Omit<PlaceCategory, 'hasVisitMission'>
  items: ItemOfCategory[]
  type: 'place' | 'route'
}> = ({ category, items, type }) => {
  const t = useTranslations('explore')

  if (items.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <PlaceMarker icon={category.icon} color={category.color} size="lg" />

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

      <ul className="flex items-stretch overflow-x-auto px-2 scrollbar-hide">
        {items.map((item) => (
          <li className="contents" key={item.id}>
            <ListItemsOfCategoryItem item={item} type={type} />
          </li>
        ))}
        <li>
          <Link
            href={
              type === 'place'
                ? `/explore/search?placeCategory=${category.id}`
                : `/explore/search?routeCategory=${category.id}`
            }
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

export const ListPlacesOfCategorySkeleton: FC = () => {
  return (
    <div className="space-y-2 py-4">
      <div className="flex items-center gap-4 px-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-6 w-full max-w-32 rounded-full" />
        <div className="grow" />
        <Skeleton className="h-3 w-full max-w-16 rounded-full" />
        <IconChevronRight stroke={1.5} className="-ml-4 text-stone-300" />
      </div>

      <div className="space-x-4 overflow-x-hidden whitespace-nowrap pl-4 scrollbar-hide">
        {[...Array(3)].map((_, i) => (
          <div className="inline-block w-[calc(50vw-3rem)] min-w-32 max-w-72 space-y-2">
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="mx-auto h-4 w-full max-w-28 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
