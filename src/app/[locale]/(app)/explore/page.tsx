import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import {
  onlyTranslatableLocales,
  parseLocale,
  type LocaleRouteParams,
} from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { ListCategoryGroups } from './_components/list-category-groups'
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

  const trpc = await getTrpc()
  const categoryGroups = await trpc.explore.listCategoryGroups({
    locale: onlyTranslatableLocales(locale),
  })

  return (
    <div className="pt-6">
      <OverrideMainMap reset />

      {categoryGroups.map((group) => (
        <ListCategoryGroups key={group.id} group={group} />
      ))}
    </div>
  )
}

export default ExplorePage
