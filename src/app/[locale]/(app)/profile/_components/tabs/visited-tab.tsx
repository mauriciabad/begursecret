import { useLocale,useTranslations } from 'next-intl'
import { FC } from 'react'
import { onlyTranslatableLocales } from '~/i18n'
import { trpc } from '~/trpc'
import { PlaceList } from '../../../explore/_components/place-list'

export const VisitedTab: FC = () => {
  const t = useTranslations('profile.tabs.visited')
  const locale = useLocale()
  const { data: places } = trpc.placeLists.getVisitedPlaces.useQuery({
    locale: onlyTranslatableLocales(locale),
  })

  return (
    <>
      <h2 className="text-center font-title font-medium">
        {t('visited-places')}
      </h2>

      {!places ? (
        <p className="text-center text-gray-400">{t('loading')}</p>
      ) : places.length === 0 ? (
        <p className="text-center text-gray-400">{t('no-places')}</p>
      ) : (
        <PlaceList places={places} />
      )}
    </>
  )
}
