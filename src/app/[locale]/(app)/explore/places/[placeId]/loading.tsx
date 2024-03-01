import { Card, CardBody } from '@nextui-org/card'
import { Skeleton } from '@nextui-org/skeleton'
import { FC } from 'react'
import { MissionAcordionSkeleton } from '../../../missions/loading'

const Loading: FC = () => {
  return (
    <>
      <Skeleton className="mx-auto mt-4 h-6 w-full max-w-64 rounded-full" />

      <Skeleton className="mt-4 h-4 w-full rounded-full" />
      <Skeleton className="mt-2 h-4 w-full max-w-24 rounded-full" />

      <Skeleton className="mt-4 h-10 w-full rounded-xl" />

      <Skeleton className="mt-4 aspect-[4/3] w-full rounded-xl" />

      <Skeleton className="mt-4 h-6 w-16 rounded-full" />

      <Card className="mt-4 bg-cream" radius="lg" shadow="none">
        <CardBody className="gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-2 h-4 w-16 rounded-full" />
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-2 w-full max-w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Skeleton className="mt-8 h-6 w-full max-w-32 rounded-full" />
      <div className="mt-4">
        <Skeleton className="mb-2 h-3 w-full rounded-full" />
        <Skeleton className="mb-2 h-3 w-full rounded-full" />
        <Skeleton className="mb-4 h-3 w-full max-w-48 rounded-full" />

        <Skeleton className="mb-2 h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-full max-w-24 rounded-full" />
      </div>

      <Skeleton className="mt-8 h-6 w-full max-w-32 rounded-full" />
      <MissionAcordionSkeleton className="mt-4" />
    </>
  )
}

export default Loading
