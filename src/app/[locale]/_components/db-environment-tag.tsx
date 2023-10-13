import type { FC } from 'react'

const isUsingLocalDb = process.env.USE_LOCAL_DB === 'true'
const isProduction = process.env.NODE_ENV === 'production'

export const DbEnvironmentTag: FC = () => {
  return (
    <>
      {!isProduction &&
        (isUsingLocalDb ? (
          <span className="mr-2 rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Local
          </span>
        ) : (
          <span className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Prod
          </span>
        ))}
    </>
  )
}
