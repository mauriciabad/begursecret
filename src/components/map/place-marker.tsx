import { FC } from 'react'
import { PlaceCategoryIcon } from '~/components/icons/place-category-icon'
import { cn } from '~/helpers/cn'
import {
  PlaceCategoryColor,
  PlaceCategoryIcon as PlaceCategoryIconType,
} from '~/server/db/constants/places'

export type PlaceMarkerProps = {
  icon?: PlaceCategoryIconType
  color?: PlaceCategoryColor
  className?: string
  size?: 'normal' | 'tiny'
  animated?: boolean
  name?: string
  showName?: boolean
}

export const PlaceMarker: FC<PlaceMarkerProps> = ({
  icon,
  className,
  color,
  size = 'normal',
  animated,
  name,
  showName,
}) => {
  const colorClassName = {
    'border-gray-800 bg-gray-700 before:bg-gray-700': color === 'gray',
    'border-red-800 bg-red-500 before:bg-red-500': color === 'red',
    'border-orange-800 bg-orange-500 before:bg-orange-500': color === 'orange',
    'border-amber-800 bg-amber-500 before:bg-amber-500': color === 'amber',
    'border-yellow-800 bg-yellow-500 before:bg-yellow-500': color === 'yellow',
    'border-lime-800 bg-lime-500 before:bg-lime-500': color === 'lime',
    'border-green-800 bg-green-500 before:bg-green-500': color === 'green',
    'border-emerald-800 bg-emerald-500 before:bg-emerald-500':
      color === 'emerald',
    'border-teal-800 bg-teal-500 before:bg-teal-500': color === 'teal',
    'border-cyan-800 bg-cyan-500 before:bg-cyan-500': color === 'cyan',
    'border-sky-800 bg-sky-500 before:bg-sky-500': color === 'sky',
    'border-blue-800 bg-blue-500 before:bg-blue-500': color === 'blue',
    'border-indigo-800 bg-indigo-500 before:bg-indigo-500': color === 'indigo',
    'border-violet-800 bg-violet-500 before:bg-violet-500': color === 'violet',
    'border-purple-800 bg-purple-500 before:bg-purple-500': color === 'purple',
    'border-fuchsia-800 bg-fuchsia-500 before:bg-fuchsia-500':
      color === 'fuchsia',
    'border-pink-800 bg-pink-500 before:bg-pink-500': color === 'pink',
    'border-rose-800 bg-rose-500 before:bg-rose-500': color === 'rose',
  } as const

  return (
    <>
      {size === 'tiny' ? (
        <div
          className={cn(
            {
              'before:absolute before:inset-0 before:-z-10 before:animate-ping before:rounded-full':
                animated,
            },
            className,
            'group relative box-border h-3 w-3 rounded-full border shadow',
            'border-gray-800 bg-gray-700',
            colorClassName,
            'border-white'
          )}
        />
      ) : (
        <div
          className={cn(
            {
              'before:absolute before:inset-0 before:-z-10 before:animate-ping before:rounded-full':
                animated,
            },
            className,
            'group relative inline-block rounded-full border p-[3px] shadow',
            'border-gray-800 bg-gray-700',
            colorClassName
          )}
        >
          {name && (
            <div
              className={cn(
                'absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1',
                'pointer-events-none rounded-full border border-stone-600 bg-white px-2 py-0.5 text-xs text-black shadow-md',
                'text-nowrap',
                { 'hidden group-hover:block': !showName }
              )}
            >
              {name}
              <svg
                className="absolute left-0 top-full h-2 w-full text-white"
                viewBox="0 0 255 255"
              >
                <polygon
                  className="fill-current"
                  points="0,0 127.5,127.5 255,0"
                />
              </svg>
            </div>
          )}
          <PlaceCategoryIcon
            icon={icon}
            className="text-white"
            size={18}
            stroke={2}
          />
        </div>
      )}
    </>
  )
}
