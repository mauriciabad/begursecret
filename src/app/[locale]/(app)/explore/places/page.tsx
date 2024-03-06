import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import {
  onlyTranslatableLocales,
  parseLocale,
  type LocaleRouteParams,
} from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { CategoriesGrid } from '../_components/categories-grid'
import { ListPlacesOfCategory } from '../_components/list-places-of-category'
import { OverrideMainMap } from '../_components/override-main-map'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'explore.places',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const PlacesPage: FC<LocaleRouteParams> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const trpc = await getTrpc()
  const placesByCategory = await trpc.explore.listPlaces({
    locale: onlyTranslatableLocales(locale),
  })

  return (
    <>
      <OverrideMainMap reset />

      <CategoriesGrid categories={placesByCategory} />

      <div className="space-y-2">
        {placesByCategory.map((category) => (
          <ListPlacesOfCategory
            key={category.id}
            category={category}
            places={category.places}
          />
        ))}
      </div>
    </>
  )
}

export default PlacesPage
