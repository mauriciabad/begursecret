'use client'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { FC, FormEvent, useState } from 'react'

export const ContinueWithEmail: FC<{
  className?: string
}> = ({ className }) => {
  const t = useTranslations('auth')
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hasError, setHasError] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const signInResponse = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setHasError(!signInResponse?.ok)
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
        isInvalid={hasError}
      />
      <div className="flex items-end gap-4">
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
          isInvalid={hasError}
        />
        <Button variant="solid" color="primary" type="submit">
          {t('send')}
        </Button>
      </div>
    </form>
  )
}
