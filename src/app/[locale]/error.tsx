'use client'

import { Button } from '@nextui-org/button'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { LinkButtonCustom } from '~/components/links/link-button-custom'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error-pages.generic')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 font-title text-7xl font-extrabold tracking-tight text-primary-600 lg:text-9xl">
              500
            </h1>
            <p className="mb-8 font-title text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
              {t('internal-server-error')}
            </p>

            <p className="mb-2 text-lg font-light text-stone-500">
              {t('message')}
            </p>
            <p className="mx-auto mb-8 inline-block rounded-md bg-stone-200 p-2 font-mono font-bold leading-none">
              {error.digest}
            </p>

            {process.env.NODE_ENV === 'development' && (
              <>
                <p className="mb-2 text-lg font-light text-stone-500">
                  {t('error-message')}
                </p>
                <pre className="mb-8 whitespace-normal break-normal rounded-md bg-stone-800 px-6 py-4 text-left font-mono text-sm text-white">
                  {error.message}
                </pre>
              </>
            )}

            <p className="mb-2 text-lg font-light text-stone-500">
              {t('actions')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <LinkButtonCustom href="/">{t('go-home')}</LinkButtonCustom>
              <Button
                onPress={() => reset()}
                radius="full"
                variant="solid"
                color="primary"
                className=" mt-6 bg-brand-600 px-8 py-3 uppercase text-white"
              >
                {t('try-again')}
              </Button>
              <LinkButtonCustom href="mailto:hello@mauriciabad.com">
                {t('contact-support')}
              </LinkButtonCustom>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
