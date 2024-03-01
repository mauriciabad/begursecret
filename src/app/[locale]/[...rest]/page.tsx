import { unstable_setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { FC } from 'react'
import { LocaleRouteParams, parseLocale } from '~/i18n'

const CatchAllPage: FC<LocaleRouteParams> = ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  return notFound()
}

export default CatchAllPage
