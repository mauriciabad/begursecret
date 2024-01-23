import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { LinkButton } from '~/components/links/link-button'
import { ContinueWithEmail } from './continue-with-email'
import { ContinueWithProvider } from './continue-with-provider'
import { RegisterBanner } from './register-banner'

export const ProfileLogin: FC<{ registerDisabled?: boolean }> = ({
  registerDisabled,
}) => {
  const t = useTranslations('auth')

  return (
    <>
      {!registerDisabled && <RegisterBanner />}

      <div className="mx-auto mt-10  max-w-sm">
        <h2 className="mb-2 text-center font-title text-2xl font-semibold uppercase text-stone-800">
          {t('login')}
        </h2>
        <ContinueWithEmail />

        <div className="mb-2 mt-4 flex items-center gap-2">
          <div className="flex-1 border-t border-stone-300" aria-hidden />
          <h3 className=" inline-block font-title text-sm font-medium uppercase text-stone-600">
            {t('continue-with')}
          </h3>
          <div className="flex-1 border-t border-stone-300" aria-hidden />
        </div>
        <ContinueWithProvider />

        {!registerDisabled && (
          <>
            <h2 className="mb-2 mt-10 text-center font-title text-2xl font-semibold uppercase text-stone-800">
              {t('register')}
            </h2>
            <LinkButton
              href="/register"
              variant="solid"
              color="primary"
              fullWidth
            >
              {t('register')}
            </LinkButton>
          </>
        )}
      </div>
    </>
  )
}
