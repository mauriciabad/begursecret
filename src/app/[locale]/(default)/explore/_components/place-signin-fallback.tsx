import { useTranslations } from 'next-intl'
import type { FC } from 'react'

import { SigninLink } from '~/components/signin-link'

export const PlaceSigninFallback: FC = () => {
  const t = useTranslations('places')
  return (
    <div>
      {t.rich('signIn', {
        link: (chunks) => <SigninLink>{chunks}</SigninLink>,
      })}
    </div>
  )
}
