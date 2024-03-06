import { FC } from 'react'
import { CategoriesGridSkeleton } from '../_components/categories-grid'
import { ListPlacesOfCategorySkeleton } from '../_components/list-items-of-category'

const Loading: FC = () => {
  return (
    <>
      <CategoriesGridSkeleton />

      {[...Array(5)].map((_, i) => (
        <ListPlacesOfCategorySkeleton key={i} />
      ))}
    </>
  )
}

export default Loading
