import { FC } from 'react'
import { CategoryIcon } from '~/components/icons/category-icon'
import { IconName } from '~/server/db/constants/shared'

export const CategoryTag: FC<{
  category: {
    icon: IconName | null
    name: string
  }
}> = ({ category }) => {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-1.5 py-0.5 text-stone-800">
      <CategoryIcon icon={category.icon} size={16} />
      <span className="whitespace-nowrap text-sm leading-none">
        {category.name}
      </span>
    </span>
  )
}
