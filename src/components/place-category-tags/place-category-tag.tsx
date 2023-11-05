import { FC } from 'react'
import { PlaceCategoryIcon } from '~/components/icons/place-category-icon'
import { PlaceCategoryIcon as PlaceCategoryIconType } from '~/server/db/constants/places'

export const PlaceCategoryTag: FC<{
  category: {
    icon: PlaceCategoryIconType | null
    name: string
  }
}> = ({ category }) => {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-1.5 py-0.5 text-stone-800">
      <PlaceCategoryIcon icon={category.icon} size={16} />
      <span className="text-sm leading-none">{category.name}</span>
    </span>
  )
}
