import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { AuthRequired } from '~/components/auth-required'
import { SigninLink } from '~/components/signin-link'

import { TextLink } from '~/components/text-link'
import type { LocaleRouteParams } from '~/i18n'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'home')
  return {
    description: t('meta.description'),
  }
}

const HomePage: FC<LocaleRouteParams> = () => {
  const t = useTranslations('home')

  return (
    <>
      <h1 className="mb-8 text-2xl">{t('heading')}</h1>

      <AuthRequired
        fallback={
          <div>
            {t.rich('signIn', {
              link: (chunks) => <SigninLink>{chunks}</SigninLink>,
            })}
          </div>
        }
      >
        <p>You are authenticated and can see this content. </p>
      </AuthRequired>

      <TextLink href="/explore">{t('lunchApp')}</TextLink>
    </>
  )
}


export default HomePage
