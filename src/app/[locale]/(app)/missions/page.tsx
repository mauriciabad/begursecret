import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import {
  onlyTranslatableLocales,
  parseLocale,
  type LocaleRouteParams,
} from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { VisitMissionsAcordion } from './_components/visit-missions-acordion'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'missions',
  })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const MissionsPage: FC<LocaleRouteParams> = async ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

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
