import type { getProviders } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'

import { ProviderButton } from './provider-button'
import { TextLink } from '~/components/text-link'

type SignInPageContentProps = {
  providers: Exclude<Awaited<ReturnType<typeof getProviders>>, null>
}

export const SignInPageContent: FC<SignInPageContentProps> = ({
  providers,
}) => {
  const t = useTranslations('signIn')
  return (
    <>
      <h1 className="mb-8 text-2xl">{t('heading')}</h1>
      <ul className="grid gap-4">
        {Object.values(providers).map((provider) => (
          <li key={provider.name}>
            <ProviderButton provider={provider} />
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <TextLink href="/">{t('goHome')}</TextLink>
      </div>
    </>
  )
}
