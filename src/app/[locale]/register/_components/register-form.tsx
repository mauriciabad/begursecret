'use client'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { FC, FormEvent, useState } from 'react'
import { trpc } from '~/trpc'

export const RegisterForm: FC<{
  className?: string
}> = ({ className }) => {
  const t = useTranslations('auth')
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const register = trpc.auth.register.useMutation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    await register.mutateAsync({ email, password, name })

    await signIn('credentials', {
      email,
      password,
      name,
      callbackUrl: '/profile',
    })
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
      />

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
      />

      <Input
        label={t('inputs.name')}
        variant="bordered"
        labelPlacement="outside"
        placeholder={t('inputs.name-placeholder')}
        isRequired
        type="text"
        value={name}
        onValueChange={setName}
      />

      {register.error && (
        <p className="mt-8 text-danger-700">{register.error.message}</p>
      )}

      <Button
        className="mt-8"
        variant="solid"
        color="primary"
        type="submit"
        fullWidth
      >
        {t('send')}
      </Button>
    </form>
  )
}
