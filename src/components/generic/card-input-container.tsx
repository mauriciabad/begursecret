import { Card, CardBody } from '@nextui-org/react'
import { FC, PropsWithChildren } from 'react'
import { cn } from '~/helpers/cn'

export const CardInputContainer: FC<
  PropsWithChildren<{
    className?: string
    label?: string
    errorMessage?: string
    isInvalid?: boolean
  }>
> = ({ className, label, errorMessage, isInvalid, children }) => {
  return (
    <div className={cn(className)}>
      {label && <p className="mb-1">{label}</p>}
      {isInvalid && <p className="text-red-500">{errorMessage}</p>}

      <Card radius="sm" className={cn(isInvalid && 'border-2 border-red-500')}>
        <CardBody className="gap-4 p-5">{children}</CardBody>
      </Card>
    </div>
  )
}
