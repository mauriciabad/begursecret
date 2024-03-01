import { Skeleton } from '@nextui-org/react'
import { FC } from 'react'

const Loading: FC = () => {
  return (
    <>
      <div className="bg-white shadow">
        <div className="space-y-4 p-4">
          <Skeleton className="mx-auto h-24 w-24 rounded-full" />
          <Skeleton className="mx-auto h-4 w-full max-w-32 rounded-full" />
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4 px-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2 p-2">
              <Skeleton className="mx-auto h-6 w-6 rounded-full" />
              <Skeleton className="mx-auto h-2 w-full max-w-12 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Loading
