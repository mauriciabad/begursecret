'use client'

import { Image } from '@nextui-org/image'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { PlaceCategoryIcon } from '~/components/icons/place-category-icon'
import { MarkdownContent } from '~/components/markdown-content'
import { makeImageUrl } from '~/helpers/images'
import { MapPoint } from '~/helpers/spatial-data'
import { PlaceCategoryIcon as PlaceCategoryIconType } from '~/server/db/constants/places'

export const PlaceDetails: FC<{
  placeFullInfo: {
    id: number
    mainImage: string | null
    location: MapPoint
    name: string
    description: string | null
    content: string | null
    mainCategory: {
      icon: PlaceCategoryIconType | null
      name: string
    }
    categories: {
      category: { icon: PlaceCategoryIconType | null; name: string }
    }[]
  }
}> = ({ placeFullInfo: place }) => {
  const t = useTranslations('explore.details')

  return (
    <>
      <div className="grid grid-cols-[1fr_auto] px-4 py-2">
        <div>
          <h2 className="font-title font-bold">{place.name}</h2>
          <div className="flex flex-wrap items-center justify-start gap-1">
            <span className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-stone-50 px-2 py-1 text-sm leading-none text-stone-500">
              <PlaceCategoryIcon icon={place.mainCategory.icon} size={16} />
              {place.mainCategory.name}
            </span>
            {place.categories.length >= 1 && (
              <span className="h-4 w-[1px] bg-stone-200" />
            )}
            {place.categories.map(({ category }) => (
              <span className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-stone-50 px-2 py-1 text-sm leading-none text-stone-500">
                <PlaceCategoryIcon icon={category.icon} size={16} />
                {category.name}
              </span>
            ))}
          </div>
          <p className="line-clamp-3 text-sm text-gray-500">
            {place.description}
          </p>
        </div>

        <Image
          radius="md"
          alt={place.name}
          className="z-0 aspect-square h-16 object-cover"
          src={makeImageUrl(place.mainImage)}
        />
      </div>

      {place.content ? (
        <MarkdownContent content={place.content} className="px-4" />
      ) : (
        <p className="p-4 text-center text-sm text-gray-500">
          {t('no-more-info')}
        </p>
      )}
    </>
  )
}
