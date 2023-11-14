import type { Metadata } from 'next'
import { useLocale } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { LocaleParams, onlyTranslatableLocales } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { PlaceList } from '../_components/place-list'

type PageParams = {
  params: LocaleParams
  searchParams: {
    category: string
  }
}
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'explore')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const ExplorePage: FC<PageParams> = async ({ searchParams }) => {
  const locale = useLocale()
  const trpc = await getTrpc()
  const places = await trpc.places.search({
    locale: onlyTranslatableLocales(locale),
    category: Number(searchParams.category),
  })

  // TODO: Filter places by {searchParams.category}

  return (
    <>
      <PlaceList places={places} />
    </>
  )
}

export default ExplorePage
