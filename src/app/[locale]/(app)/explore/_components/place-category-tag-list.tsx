import { FC } from 'react'
import { PlaceCategoryIcon as PlaceCategoryIconType } from '~/server/db/constants/places'
import { PlaceCategoryTag } from './place-category-tag'

export const PlaceCategoryTagList: FC<{
  mainCategory: {
    icon: PlaceCategoryIconType | null
    name: string
  }
  categories: {
    icon: PlaceCategoryIconType | null
    name: string
  }[]
}> = ({ categories, mainCategory }) => {
  return (
    <div className="mt-2 flex flex-wrap items-center justify-start gap-1">
      <PlaceCategoryTag category={mainCategory} />

      {categories.length && <span className="h-4 w-[1px] bg-stone-200" />}

      {categories.map((category) => (
        <PlaceCategoryTag category={category} />
      ))}
    </div>
  )
}
