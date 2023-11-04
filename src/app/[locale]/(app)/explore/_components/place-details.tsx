'use client'

import { Button } from '@nextui-org/button'
import { Image } from '@nextui-org/image'
import { IconPhoto } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { MarkdownContent } from '~/components/markdown-content'
import { makeImageUrl } from '~/helpers/images'
import { MapPoint } from '~/helpers/spatial-data'
import { PlaceCategoryIcon as PlaceCategoryIconType } from '~/server/db/constants/places'
import { PlaceCategoryTagList } from './place-category-tag-list'

export const PlaceDetails: FC<{
  placeFullInfo: {
    id: number
    mainImage: string | null
    images?: { key: string }[]
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
  const t = useTranslations('explore')

  return (
    <div className="p-4">
      <h2 className="font-title text-xl font-semibold">{place.name}</h2>

      {place.description && (
        <p className="text-stone-800">{place.description}</p>
      )}

      {place.images?.length ? (
        <div className="mt-4 grid grid-cols-[2fr_1fr] grid-rows-2 gap-2">
          <Image
            radius="lg"
            shadow="sm"
            alt={place.name}
            className="aspect-[4/3] object-cover"
            classNames={{
              wrapper: 'row-span-2',
            }}
            src={makeImageUrl(place.mainImage)}
          />
          <Image
            radius="lg"
            shadow="sm"
            alt={place.name}
            className="h-full object-cover"
            src={makeImageUrl(place.images[0].key)}
          />
          <Button
            radius="lg"
            variant="bordered"
            startContent={<IconPhoto size={24} />}
            className="flex h-full flex-col items-center justify-center gap-1 font-semibold"
          >
            {t('see-more')}
          </Button>
        </div>
      ) : (
        <Image
          radius="lg"
          shadow="sm"
          alt={place.name}
          className="mt-4 aspect-[4/3] object-cover"
          src={makeImageUrl(place.mainImage)}
        />
      )}

      <PlaceCategoryTagList
        mainCategory={place.mainCategory}
        categories={place.categories.map((c) => c.category)}
      />

      {place.content ? (
        <MarkdownContent content={place.content} className="mt-4" />
      ) : (
        <p className="mt-4 py-4 text-center text-sm text-stone-500">
          {t('no-more-info')}
        </p>
      )}
    </div>
  )
}
