'use client'

import { cn } from '~/helpers/cn'
import { useTranslations } from 'next-intl'
import type { FC, HTMLAttributes } from 'react'

import { trpc } from '~/trpc'

export const PlaceList: FC<Omit<HTMLAttributes<HTMLElement>, 'children'>> = ({
  className,
  ...props
}) => {
  const t = useTranslations('explore.list')
  const { data: places, isInitialLoading } = trpc.places.list.useQuery()

  if (isInitialLoading) {
    return (
      <div
        className={cn(
          'rounded border border-gray-200 bg-gray-200 px-4 py-2 text-lg',
          className
        )}
        {...props}
      >
        {t('loading')}
      </div>
    )
  }

  return (
    <ul className={cn('grid gap-4', className)} {...props}>
      {places?.map((place) => (
        <li
          key={place.id}
          className="flex items-center justify-between rounded border border-gray-500 px-4 py-2"
        >
          <span className="text-lg">{place.name}</span>
        </li>
      ))}
    </ul>
  )
}
