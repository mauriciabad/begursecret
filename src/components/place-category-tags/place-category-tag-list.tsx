import { FC } from 'react'
import { cn } from '~/helpers/cn'
import { PlaceCategoryIcon as PlaceCategoryIconType } from '~/server/db/constants/places'
import { PlaceCategoryTag } from './place-category-tag'

export const PlaceCategoryTagList: FC<{
  mainCategory?: {
    id: number
    icon: PlaceCategoryIconType | null
    name: string
  } | null
  categories?: {
    id: number
    icon: PlaceCategoryIconType | null
    name: string
  }[]
  wrap?: boolean
  className?: string
}> = ({ categories, mainCategory, wrap, className }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-start gap-1',
        {
          'flex-wrap': wrap,
        },
        className
      )}
    >
      {mainCategory && <PlaceCategoryTag category={mainCategory} />}

      {mainCategory && categories !== undefined && categories.length >= 1 && (
        <span className="h-4 w-[1px] bg-stone-200" />
      )}

      {categories?.map((category) => (
        <PlaceCategoryTag key={category.id} category={category} />
      ))}
    </div>
  )
}
