import { Skeleton } from '@nextui-org/react'
import { FC } from 'react'

const Loading: FC = () => {
  return (
    <>
      <div className="mt-8 space-y-4">
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </>
  )
}

export default Loading
