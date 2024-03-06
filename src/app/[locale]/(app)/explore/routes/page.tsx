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
    namespace: 'explore.routes',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const RoutesPage: FC<LocaleRouteParams> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const trpc = await getTrpc()
  const routesByCategory = await trpc.explore.listRoutes({
    locale: onlyTranslatableLocales(locale),
  })

  return (
    <>
      <OverrideMainMap reset />

      <CategoriesGrid categories={routesByCategory} />

      <div className="space-y-2">
        {routesByCategory.map((category) => (
          <ListPlacesOfCategory
            key={category.id}
            category={category}
            items={category.routes}
            type="route"
          />
        ))}
      </div>
    </>
  )
}

export default RoutesPage
