'use client'

import { Button } from '@nextui-org/button'
import { signIn, type ClientSafeProvider } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import type { FC } from 'react'

type ProviderButtonProps = {
  provider: ClientSafeProvider
}

export const ProviderButton: FC<ProviderButtonProps> = ({ provider }) => {
  const t = useTranslations('signIn')
  const locale = useLocale()
  const searchParams = useSearchParams()

  const handleClick = () => {
    signIn(provider.id, {
      callbackUrl: searchParams.get('callbackUrl') || `/${locale}`,
    })
  }

  return (
    <Button onClick={handleClick}>
      {t('providerButtonText', { name: provider.name })}
    </Button>
  )
}
