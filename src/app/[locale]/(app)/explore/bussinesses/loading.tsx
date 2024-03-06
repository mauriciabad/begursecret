import { FC } from 'react'
import { ListPlacesOfCategorySkeleton } from '../_components/list-places-of-category'

const Loading: FC = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <ListPlacesOfCategorySkeleton key={i} />
      ))}
    </>
  )
}

export default Loading
