'use client'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import {
  IconAlertTriangleFilled,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { FC, FormEvent, useState } from 'react'

type CredentialsLoginErrors =
  | 'invalidInput'
  | 'userDoesNotExist'
  | 'userDoesNotHavePassword'
  | 'incorrectPassword'

export const ContinueWithEmail: FC<{
  className?: string
}> = ({ className }) => {
  const t = useTranslations('auth')
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<
    CredentialsLoginErrors | 'otherError' | undefined
  >(undefined)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const signInResponse = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (
      signInResponse?.error === 'invalidInput' ||
      signInResponse?.error === 'userDoesNotExist' ||
      signInResponse?.error === 'userDoesNotHavePassword' ||
      signInResponse?.error === 'incorrectPassword'
    ) {
      setError(signInResponse.error)
      return
    }

    if (!signInResponse?.ok) {
      setError('otherError')
      return
    }

    setError(undefined)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Input
        label={t('inputs.email')}
        variant="bordered"
        labelPlacement="outside"
        placeholder={t('inputs.email-placeholder')}
        isRequired
        type="email"
        value={email}
        onValueChange={setEmail}
        isInvalid={error === 'userDoesNotExist'}
        errorMessage={error === 'userDoesNotExist' && t(`errors.${error}`)}
      />
      <div className="flex items-start gap-4">
        <Input
          className="mt-2 flex-grow"
          label={t('inputs.password')}
          variant="bordered"
          labelPlacement="outside"
          placeholder={t('inputs.password-placeholder')}
          value={password}
          onValueChange={setPassword}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <IconEyeOff className="pointer-events-none text-stone-400" />
              ) : (
                <IconEye className="pointer-events-none text-stone-400" />
              )}
            </button>
          }
          isRequired
          type={isVisible ? 'text' : 'password'}
          isInvalid={error === 'incorrectPassword'}
          errorMessage={error === 'incorrectPassword' && t(`errors.${error}`)}
        />

        <Button
          className="mt-[34px]"
          variant="solid"
          color="primary"
          type="submit"
        >
          {t('send')}
        </Button>
      </div>

      {(error === 'otherError' ||
        error === 'invalidInput' ||
        error === 'userDoesNotHavePassword') && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 leading-4 text-white">
          <IconAlertTriangleFilled size={18} />
          <p className="flex-grow text-sm">{t(`errors.${error}`)}</p>
        </div>
      )}
    </form>
  )
}
