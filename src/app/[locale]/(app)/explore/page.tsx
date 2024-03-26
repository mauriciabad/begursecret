import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import {
  onlyTranslatableLocales,
  parseLocale,
  type LocaleRouteParams,
} from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import {
  CategoryGroupListItem,
  ListCategoryGroups,
} from './_components/list-category-groups'
import { OverrideMainMap } from './_components/override-main-map'

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

const ExplorePage: FC<LocaleRouteParams> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const t = await getTranslations('explore')

  const trpc = await getTrpc()
  const categoryGroups = await trpc.explore.listCategoryGroups({
    locale: onlyTranslatableLocales(locale),
  })
  const routeCategories = await trpc.explore.listRouteCategories({
    locale: onlyTranslatableLocales(locale),
  })

  const groups: CategoryGroupListItem[] = categoryGroups.map((group) => ({
    ...group,
    categories: group.placeCategories,
    type: 'place',
  })).filter((group) => group.id !== 2) // TODO: Temporarily disabled "Punts d'oci i esport naturals".  Enable it later.

  groups
    .splice(1, 0, {
      name: t('category-groups.routes'),
      id: 9999999,
      order: null,
      categories: routeCategories.map((category) => ({
        category,
        highlight: [1, 2, 3, 5].includes(category.id),
      })),
      type: 'route',
    })

  return (
    <div className="pt-6">
      <OverrideMainMap reset />

      {groups.map((group) => (
        <ListCategoryGroups key={group.id} group={group} />
      ))}
    </div>
  )
}

export default ExplorePage
