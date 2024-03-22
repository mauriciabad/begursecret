import { useLocale, useTranslations } from 'next-intl'
import { FC, useMemo } from 'react'
import { onlyTranslatableLocales } from '~/i18n'
import { trpc } from '~/trpc'
import { PlaceList } from '../../../explore/search/_components/place-list'

export const VisitedTab: FC = () => {
  const t = useTranslations('profile.tabs.visited')
  const locale = useLocale()
  const { data: places } = trpc.placeLists.getVisitedPlaces.useQuery({
    locale: onlyTranslatableLocales(locale),
  })

  const placesWithTypes = useMemo(
    () =>
      places?.map((place) => ({
        type: 'place' as const,
        ...place,
      })),
    [places]
  )

  return (
    <>
      <h2 className="text-center font-title font-medium">
        {t('visited-places')}
      </h2>

      {!placesWithTypes ? (
        <p className="mt-2 text-center text-gray-400">{t('loading')}</p>
      ) : placesWithTypes.length === 0 ? (
        <p className="mt-2 text-center text-gray-400">{t('no-places')}</p>
      ) : (
        <PlaceList items={placesWithTypes} />
      )}
    </>
  )
}
