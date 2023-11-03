import type { Metadata } from 'next'
import { useLocale } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { Map } from '~/components/map/map'
import { cn } from '~/helpers/cn'
import { LocaleParams, onlyTranslatableLocales } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { MapDrawer } from '../_components/map-drawer'
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
        <PlaceList places={places} />
      </MapDrawer>
    </>
  )
}

export default ExplorePage
