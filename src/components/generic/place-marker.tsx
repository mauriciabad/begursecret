import { FC } from 'react'
import { CategoryIcon } from '~/components/icons/category-icon'
import { cn } from '~/helpers/cn'
import { colorClasses } from '~/helpers/color-classes'
import { ColorName, IconName } from '~/server/db/constants/shared'

export type PlaceMarkerProps = {
  icon?: IconName
  color?: ColorName
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'none'
  animated?: boolean
  name?: string
  showName?: boolean
  isDisabled?: boolean
}

export const PlaceMarker: FC<PlaceMarkerProps> = ({
  icon,
  className,
  color,
  size = 'md',
  animated,
  name,
  showName,
  isDisabled,
}) => {
  if (size === 'none') return null

  if (size === 'sm' || size === 'xs')
    return (
      <div
        className={cn(
          animated &&
            'before:absolute before:inset-0 before:-z-10 before:animate-ping before:rounded-full',
          className,
          'group relative box-border h-3 w-3 rounded-full border shadow',
          'border-gray-800 bg-gray-700',
          color && [
            colorClasses.bg[color],
            colorClasses.beforeBg[color],
            colorClasses.border[color],
          ],
          'border-white',
          size === 'xs' && 'h-2 w-2',
          isDisabled && 'opacity-50'
        )}
      >
        {name && (
          <MarkerTooltip
            name={name}
            className={cn({ 'hidden group-hover:block': !showName })}
          />
        )}
      </div>
    )

  if (size === 'lg')
    return (
      <div
        className={cn(
          'relative rounded-full border-2 p-1 text-white',
          color && [colorClasses.bg[color], colorClasses.border600[color]],
          className
        )}
      >
        <CategoryIcon
          icon={icon}
          className={cn(
            'block h-6 w-6',
            color && [colorClasses.text600[color]]
          )}
          size={18}
          stroke={5}
          overflow="visible"
        />
        <CategoryIcon
          icon={icon}
          className="absolute inset-1 block h-6 w-6"
          size={18}
          stroke={1.75}
        />
      </div>
    )

  return (
    <div
      className={cn(
        animated &&
          'before:absolute before:inset-0 before:-z-10 before:animate-ping before:rounded-full',
        className,
        'group relative inline-block rounded-full border p-[3px] shadow',
        'border-gray-800 bg-gray-700',
        color && [
          colorClasses.bg[color],
          colorClasses.beforeBg[color],
          colorClasses.border[color],
        ],
        isDisabled && 'opacity-50'
      )}
    >
      {name && (
        <MarkerTooltip
          name={name}
          className={cn({ 'hidden group-hover:block': !showName })}
        />
      )}
      <CategoryIcon icon={icon} className="text-white" size={18} stroke={2} />
    </div>
  )
}

const MarkerTooltip: FC<{
  name: string
  className?: string
}> = ({ name, className }) => {
  return (
    <div
      className={cn(
        'absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1',
        'pointer-events-none rounded-full border border-black/50 bg-white px-2 py-0.5 shadow-md',
        'whitespace-nowrap  bg-white/90 text-xs text-black',
        className
      )}
    >
      {name}
      <svg
        className="absolute left-0 top-full h-2 w-full"
        viewBox="0 0 255 255"
      >
        <polygon className="fill-white/90" points="0,0 127.5,127.5 255,0" />
      </svg>
    </div>
  )
}
