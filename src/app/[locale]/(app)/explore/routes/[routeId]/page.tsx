import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { type FC } from 'react'
import {
  LocaleParams,
  LocaleRouteParams,
  onlyTranslatableLocales,
} from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { OverrideMainMap } from '../../_components/override-main-map'
import { RouteDetails } from '../../_components/route-details'

type Params = LocaleParams & { routeId: string }

export async function generateMetadata({
  params: { locale },
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'route' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

const RoutePage: FC<{
  params: Params
}> = async ({ params }) => {
  const routeId = Number(params.routeId)

  const trpc = await getTrpc()
  const route = await trpc.routes.get({
    locale: onlyTranslatableLocales(params.locale),
    id: routeId,
  })
  if (!route) notFound()

  const veryEmphasizedLines = new Set([routeId])

  const routeCenter = route.path[0][0]

  return (
    <>
      <OverrideMainMap
        center={{
          lat: routeCenter[0],
          lng: routeCenter[1],
        }}
        zoom={16}
        veryEmphasizedLines={veryEmphasizedLines}
      />
      <RouteDetails route={route} />
    </>
  )
}

export default RoutePage
