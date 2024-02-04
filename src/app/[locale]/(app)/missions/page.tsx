import type { Metadata } from 'next'
import { useLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import { onlyTranslatableLocales, type LocaleRouteParams } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { VisitMissionsAcordion } from './_components/visit-missions-acordion'

export async function generateMetadata({
  params: { locale },
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'missions',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const MissionsPage: FC<LocaleRouteParams> = async () => {
  const locale = useLocale()
  const trpc = await getTrpc()

  const visitMissions = await trpc.missions.getVisitMissions({
    locale: onlyTranslatableLocales(locale),
  })

  return (
    <>
      <VisitMissionsAcordion visitMissions={visitMissions} />
    </>
  )
}

export default MissionsPage
