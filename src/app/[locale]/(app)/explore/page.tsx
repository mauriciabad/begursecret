import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import { groupByKey } from '~/helpers/utilities'
import {
  onlyTranslatableLocales,
  parseLocale,
  type LocaleRouteParams,
} from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { CategoriesGrid } from './_components/categories-grid'
import { ListPlacesOfCategory } from './_components/list-places-of-category'
import { OverrideMainMap } from './_components/override-main-map'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'explore',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const ExplorePage: FC<LocaleRouteParams> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const trpc = await getTrpc()
  const places = await trpc.places.list({
    locale: onlyTranslatableLocales(locale),
  })
  const categories = await trpc.places.listCategories({
    locale: onlyTranslatableLocales(locale),
  })
  const placesByCategory = groupByKey(
    places,
    ['mainCategory.id', 'categories.0.category.id'],
    {
      unique: true,
    }
  )
  const placesByCategorySorted = categories.map((category) => ({
    categoryId: category.id,
    places: placesByCategory[category.id] ?? [],
  }))

  return (
    <>
      <OverrideMainMap reset />

      <CategoriesGrid categories={categories} />

      <div className="space-y-2">
        {placesByCategorySorted.map(({ categoryId, places }) => (
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
