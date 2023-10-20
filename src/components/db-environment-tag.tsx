import type { FC } from 'react'
import { env } from '~/env.mjs'
import { cn } from '~/helpers/cn'

const isUsingLocalDb = env.USE_LOCAL_DB === 'true'

export const DbEnvironmentTag: FC<{ className?: string }> = ({ className }) => {
  return (
    <>
      {!env.IS_PRODUCTION && (
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
