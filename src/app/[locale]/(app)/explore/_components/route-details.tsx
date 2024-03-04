import { IconBooks } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { CategoryTagList } from '~/components/category-tags/category-tag-list'
import { IconTitle } from '~/components/generic/icon-title'
import { MarkdownContent } from '~/components/generic/markdown-content'
import { OptimizedImage } from '~/components/generic/optimized-image'
import { ApiRouterOutput } from '~/server/api/router'
import { FeaturesBlock } from './features-block'
import { ViewMoreImagesButtonAndDialog } from './view-more-images-button-and-dialog'

type Route = NonNullable<ApiRouterOutput['routes']['get']>

export const RouteDetails: FC<{
  route: Route
}> = ({ route }) => {
  const t = useTranslations('explore')

  return (
    <div className="px-4">
      <h2 className="font-title text-xl font-semibold">{route.name}</h2>

      {route.description && (
        <p className="text-stone-800">{route.description}</p>
      )}

      {route.images && route.images.length >= 1 ? (
        <div className="mt-4 grid grid-cols-[2fr_1fr] grid-rows-2 gap-2">
          <OptimizedImage
            radius="lg"
            shadow="sm"
            className="aspect-[4/3]"
            classNames={{
              wrapper: 'row-span-2',
            }}
            image={route.mainImage}
            alt={route.name}
          />
          <OptimizedImage
            radius="lg"
            shadow="sm"
            alt={route.name}
            full="both"
            image={route.images[0]}
          />
          <ViewMoreImagesButtonAndDialog
            images={
              route.mainImage
                ? [route.mainImage, ...route.images]
                : route.images
            }
            buttonText={t('see-more')}
            className="h-full"
          />
        </div>
      ) : (
        <OptimizedImage
          radius="lg"
          shadow="sm"
          alt={route.name}
          className="mt-4 aspect-[4/3] object-cover"
          image={route.mainImage}
        />
      )}

      <CategoryTagList
        mainCategory={route.mainCategory}
        categories={route.categories.map((c) => c.category)}
        wrap
        className="mt-4"
      />

      <FeaturesBlock
        features={route.features}
        externalLinks={route.externalLinks}
        className="mt-4"
      />

      <IconTitle icon={IconBooks} title={t('detailed-info')} className="mt-4" />
      {route.content ? (
        <MarkdownContent content={route.content} size="sm" />
      ) : (
        <p className="mt-4 py-4 text-center text-sm text-stone-500">
          {t('no-more-info')}
        </p>
      )}
    </div>
  )
}
