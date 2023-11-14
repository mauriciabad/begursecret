import type { Metadata } from 'next'
import { useLocale } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { groupByKey } from '~/helpers/utilities'
import { onlyTranslatableLocales, type LocaleRouteParams } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { CategoriesGrid } from './_components/categories-grid'
import { ListPlacesOfCategory } from './_components/list-places-of-category'

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
      <CategoriesGrid categories={categories} />

      <div className="space-y-2">
        {Object.entries(placesByCategory).map(([categoryId, places]) => (
          <ListPlacesOfCategory
            key={categoryId}
            category={
              categories.find((category) => category.id === Number(categoryId))!
            }
            places={places}
          />
        ))}
      </div>
    </>
  )
}

export default ExplorePage
