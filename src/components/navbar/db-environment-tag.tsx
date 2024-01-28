import type { FC } from 'react'
import { env } from '~/env.mjs'
import { cn } from '~/helpers/cn'

const dbLabel = env.NEXT_PUBLIC_ENV_LABEL

const dbLabelText = {
  local: 'Local DB',
  stage: 'Stage DB',
  prod: 'Prod DB',
} as const

export const DbEnvironmentTag: FC<{ className?: string }> = ({ className }) => {
  return (
    <>
      {(env.NODE_ENV !== 'production' || env.VERCEL_ENV === 'preview') &&
        dbLabel && (
          <span
            className={cn(
              'mr-2 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800',
              {
                'bg-yellow-100 text-yellow-800': dbLabel === 'local',
                'bg-blue-100 text-blue-800': dbLabel === 'stage',
                'bg-pink-100 text-pink-800': dbLabel === 'prod',
              },
              className
            )}
          >
            {dbLabelText[dbLabel]}
          </span>
        )}
    </>
  )
}
