import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { UnderConstruction } from '~/components/generic/under-construction'

export const SavedTab: FC = () => {
  const t = useTranslations('profile.tabs.saved')

  return (
    <>
      <UnderConstruction />
      <h2 className="text-center font-title font-medium">{t('tab-title')}</h2>
      <p className="text-center">{t('under-construction')}</p>
    </>
  )
}
