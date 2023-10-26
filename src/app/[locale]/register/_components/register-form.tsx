'use client'

import { Button } from '@nextui-org/button'
import { Checkbox } from '@nextui-org/checkbox'
import { Input } from '@nextui-org/input'
import { Link as NextUILink } from '@nextui-org/link'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { signIn } from 'next-auth/react'
import { useLogger } from 'next-axiom'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { FC, FormEvent, useState } from 'react'
import { cn } from '~/helpers/cn'
import { trpc } from '~/trpc'

export const RegisterForm: FC<{
  className?: string
}> = ({ className }) => {
  const log = useLogger()
  const t = useTranslations('auth')
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const register = trpc.auth.register.useMutation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    await register.mutateAsync({ email, password })

    log.info('User registered', { email })

    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/complete-profile',
    })
  }

  return (
    <form onSubmit={handleSubmit} className={cn('py-4', className)}>
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

      <Checkbox isRequired className="mt-4">
        {t.rich('inputs.terms-of-service', {
          link: (text) => (
            <NextUILink
              as={Link}
              href="/support/terms-of-service"
              underline="always"
              isExternal
              showAnchorIcon
            >
              {text}
            </NextUILink>
          ),
        })}
      </Checkbox>

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
