import { cn } from '~/helpers/cn'
import { PlaceIcon } from '~/components/icons/place-icon'
import { PlaceType } from '~/server/db/constants/places'
import { FC } from 'react'

export const PlaceMarker: FC<{
  type?: PlaceType
  className?: string
}> = ({ type, className }) => {
  return (
    <div
      className={cn(
        className,
        '-ml-3.5 -mt-3.5 inline-block rounded-full border-2 border-white p-0.5 shadow',
        {
          'bg-gray-700': !type,
          'bg-blue-500': type === 'beach',
          'bg-red-500': type === 'monument',
          'bg-yellow-500': type === 'viewpoint',
        }
      )}
    >
      <PlaceIcon type={type} className="text-white" size={20} />
    </div>
  )
}
