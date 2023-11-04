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
}

export const PlaceMarker: FC<PlaceMarkerProps> = ({
  icon,
  className,
  color,
  size = 'normal',
}) => {
  const colorClassName = {
    'border-gray-800 bg-gray-700': color === 'gray',
    'border-red-800 bg-red-500': color === 'red',
    'border-orange-800 bg-orange-500': color === 'orange',
    'border-amber-800 bg-amber-500': color === 'amber',
    'border-yellow-800 bg-yellow-500': color === 'yellow',
    'border-lime-800 bg-lime-500': color === 'lime',
    'border-green-800 bg-green-500': color === 'green',
    'border-emerald-800 bg-emerald-500': color === 'emerald',
    'border-teal-800 bg-teal-500': color === 'teal',
    'border-cyan-800 bg-cyan-500': color === 'cyan',
    'border-sky-800 bg-sky-500': color === 'sky',
    'border-blue-800 bg-blue-500': color === 'blue',
    'border-indigo-800 bg-indigo-500': color === 'indigo',
    'border-violet-800 bg-violet-500': color === 'violet',
    'border-purple-800 bg-purple-500': color === 'purple',
    'border-fuchsia-800 bg-fuchsia-500': color === 'fuchsia',
    'border-pink-800 bg-pink-500': color === 'pink',
    'border-rose-800 bg-rose-500': color === 'rose',
  } as const

  return (
    <>
      {size === 'tiny' ? (
        <div
          className={cn(
            className,
            'box-border h-3 w-3 rounded-full border shadow',
            'border-gray-800 bg-gray-700',
            colorClassName,
            ' border-white'
          )}
        />
      ) : (
        <div
          className={cn(
            className,
            'inline-block rounded-full border p-[3px] shadow',
            'border-gray-800 bg-gray-700',
            colorClassName
          )}
        >
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
