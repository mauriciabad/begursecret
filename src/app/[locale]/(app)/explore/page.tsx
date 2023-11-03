import type { Metadata } from 'next'
import { useLocale } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { Map } from '~/components/map/map'
import { cn } from '~/helpers/cn'
import { groupByKey } from '~/helpers/utilities'
import { onlyTranslatableLocales, type LocaleRouteParams } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { CategoriesGrid } from './_components/categories-grid'
import { ListPlacesOfCategory } from './_components/list-places-of-category'
import { MapDrawer } from './_components/map-drawer'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'explore')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const ExplorePage: FC<LocaleRouteParams> = async () => {
  const locale = useLocale()
  const trpc = await getTrpc()
  const places = await trpc.places.list({
    locale: onlyTranslatableLocales(locale),
  })
  const categories = await trpc.places.listCategories({
    locale: onlyTranslatableLocales(locale),
  })
  const placesByCategory = groupByKey(places, 'mainCategory.id')

  return (
    <>
      <Map
        className={cn(
          'min-h-[calc(100dvh_-_192px)]',
          'sticky top-16 grow',
          '-mb-2 box-content pb-2'
        )}
        classNames={{
          controls: 'bottom-6',
        }}
        fullControl
        zoom={14}
        markers={places.map((place) => ({
          location: place.location,
          icon: place.mainCategory.icon,
          color: place.mainCategory.color,
          url: `/explore/places/${place.id}`,
        }))}
      />

      <MapDrawer
        classNames={{
          wrapper: 'rounded-t-lg',
        }}
      >
        <CategoriesGrid categories={categories} />

        <div className="space-y-2">
          {Object.entries(placesByCategory).map(([categoryId, places]) => (
            <ListPlacesOfCategory
              key={categoryId}
              category={
                categories.find(
                  (category) => category.id === Number(categoryId)
                )!
              }
              places={places}
            />
          ))}
        </div>
      </MapDrawer>
    </>
  )
}

export default ExplorePage
