import { Skeleton } from '@nextui-org/react'
import { IconChevronRight } from '@tabler/icons-react'
import { FC } from 'react'

const Loading: FC = () => {
  return (
    <>
      <Skeleton className="mx-auto mt-4 h-4 w-full max-w-24 rounded-full" />
      <div className="grid grid-cols-3 gap-2 p-2">
        {[...Array(3 * 2)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="mx-auto h-8 w-full max-w-32 rounded-full" />

      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2 py-4">
          <div className="flex items-center gap-4 px-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-full max-w-32 rounded-full" />
            <div className="grow" />
            <Skeleton className="h-3 w-full max-w-16 rounded-full" />
            <IconChevronRight size={24} className="-ml-4 text-stone-300" />
          </div>

          <div className="space-x-4 overflow-x-hidden whitespace-nowrap pl-4 scrollbar-hide">
            {[...Array(3)].map((_, j) => (
              <div className="inline-block w-[calc(50vw-3rem)] min-w-32 max-w-72 space-y-2">
                <Skeleton key={j} className="h-28 w-full rounded-xl" />
                <Skeleton className="mx-auto h-4 w-full max-w-28 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export default Loading
