import { FC } from 'react'
import { cn } from '~/helpers/cn'
import { IconName } from '~/server/db/constants/shared'
import { CategoryTag } from './category-tag'

export const CategoryTagList: FC<{
  mainCategory?: {
    id: number
    icon: IconName | null
    name: string
  } | null
  categories?: {
    id: number
    icon: IconName | null
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
      {mainCategory && <CategoryTag category={mainCategory} />}

      {mainCategory && categories !== undefined && categories.length >= 1 && (
        <span className="h-4 w-[1px] bg-stone-200" />
      )}

      {categories?.map((category) => (
        <CategoryTag key={category.id} category={category} />
      ))}
    </div>
  )
}
