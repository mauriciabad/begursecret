import { FC } from 'react'
import { ListCategoryGroupsSkeleton } from './_components/list-category-groups'

const Loading: FC = () => {
  return (
    <div className="pt-6">
      {[...Array(5)].map((_, i) => (
        <ListCategoryGroupsSkeleton key={i} />
      ))}
    </div>
  )
}

export default Loading
