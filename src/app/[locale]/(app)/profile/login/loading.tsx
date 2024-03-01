import { Skeleton } from '@nextui-org/react'
import { FC } from 'react'

const Loading: FC = () => {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <Skeleton className="h-[13.75rem] w-full shadow-lg" />

      <div className="px-8">
        <Skeleton className="mx-auto mb-2 mt-10 h-6 w-full max-w-48 rounded-full" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-xl" />
            <div className="flex gap-4">
              <Skeleton className="h-10 grow rounded-xl" />
              <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="my-4 h-px bg-stone-200" />
        <Skeleton className="h-10 w-full rounded-xl" />

        <Skeleton className="mx-auto mb-4 mt-10 h-6 w-full max-w-48 rounded-full" />
        <Skeleton className="mt-4 h-10 w-full rounded-xl" />
      </div>
    </div>
  )
}

export default Loading
