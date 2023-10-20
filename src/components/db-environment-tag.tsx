import type { FC } from 'react'
import { isProduction, isUsingLocalDb } from '~/helpers/client-env'
import { cn } from '~/helpers/cn'

export const DbEnvironmentTag: FC<{ className?: string }> = ({ className }) => {
  return (
    <>
      {!isProduction && (
        <span
          className={cn(
            'mr-2 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800',
            {
              'bg-yellow-100 text-yellow-800': isUsingLocalDb,
              'bg-blue-100 text-blue-800': !isUsingLocalDb,
            },
            className
          )}
        >
          {isUsingLocalDb ? 'Local' : 'Prod'}
        </span>
      )}
    </>
  )
}
