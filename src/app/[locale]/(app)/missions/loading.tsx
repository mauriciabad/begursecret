import { Card, Skeleton } from '@nextui-org/react'
import { IconChevronLeft } from '@tabler/icons-react'
import { FC } from 'react'
import { cn } from '~/helpers/cn'

const Loading: FC = () => {
  return (
    <>
      <div className="space-y-2">
        {[...Array(12)].map((_, i) => (
          <MissionAcordionSkeleton key={i} />
        ))}
      </div>
    </>
  )
}

export const MissionAcordionSkeleton: FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <Card className={cn('flex flex-row items-center p-2', className)}>
      <Skeleton className="m-1 h-10 w-10 rounded-full" />
      <Skeleton className="ml-2 h-4 w-full max-w-32 rounded-full" />
      <div className="grow" />
      <IconChevronLeft size={20} className="mr-2 text-stone-300" />
    </Card>
  )
}

export default Loading
