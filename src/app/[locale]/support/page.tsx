import { IconScript } from '@tabler/icons-react'
import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import { LinkButton } from '~/components/link-button'
import type { LocaleRouteParams } from '~/i18n'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'support')
  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
    description: t('meta.description'),
  }
}

const SupportPage: FC<LocaleRouteParams> = () => {
  const t = useTranslations('support')

  return (
    <>
      <div className="grid grid-cols-1 gap-4 py-8 xs:grid-cols-2">
        <LinkButton
          href="/support/privacy-policy"
          variant="solid"
          fullWidth
          startContent={<IconScript />}
        >
          {t('privacy-policy')}
        </LinkButton>

        <LinkButton
          href="/support/terms-of-service"
          variant="solid"
          fullWidth
          startContent={<IconScript />}
        >
          {t('terms-of-service')}
        </LinkButton>
      </div>
    </>
  )
}

export default SupportPage
