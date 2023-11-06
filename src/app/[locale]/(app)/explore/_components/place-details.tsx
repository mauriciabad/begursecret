import { Image } from '@nextui-org/image'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { MarkdownContent } from '~/components/generic/markdown-content'
import { makeImageUrl } from '~/helpers/images'
import { MapPoint } from '~/helpers/spatial-data'
import { Features } from '~/server/db/constants/features'
import { PlaceCategoryIcon as PlaceCategoryIconType } from '~/server/db/constants/places'
import { PlaceCategoryTagList } from '../../../../../components/place-category-tags/place-category-tag-list'
import { FeaturesBlock } from './features-block'
import { ViewMoreImagesButtonAndDialog } from './view-more-images-button-and-dialog'

export const PlaceDetails: FC<{
  placeFullInfo: {
    id: number
    mainImage: string | null
    images: { key: string }[]
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
    features: Features | null
  }
}> = ({ placeFullInfo: place }) => {
  const t = useTranslations('explore')

  return (
    <div className="px-4">
      <h2 className="font-title text-xl font-semibold">{place.name}</h2>

      {place.description && (
        <p className="text-stone-800">{place.description}</p>
      )}

      {place.images && place.images.length >= 1 ? (
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
          <ViewMoreImagesButtonAndDialog
            images={
              place.mainImage
                ? [{ key: place.mainImage }, ...place.images]
                : place.images
            }
            buttonText={t('see-more')}
            className="h-full"
          />
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
        wrap
        className="mt-2"
      />

      {place.features && (
        <FeaturesBlock features={place.features} className="mt-4" />
      )}

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
