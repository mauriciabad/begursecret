'use client'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { FC, useState } from 'react'

export const ContinueWithEmail: FC<{
  className?: string
}> = ({ className }) => {
  const t = useTranslations('profile.login.credentials')
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form
      onSubmit={() =>
        signIn('credentials', { username: emailOrUsername, password })
      }
      className={className}
    >
      <Input
        label={t('email-or-username')}
        variant="bordered"
        labelPlacement="outside"
        placeholder={t('email-or-username-placeholder')}
        isRequired
        type="email"
        value={emailOrUsername}
        onValueChange={setEmailOrUsername}
      />
      <div className="flex items-end gap-4">
        <Input
          className="mt-2 flex-grow"
          label={t('password')}
          variant="bordered"
          labelPlacement="outside"
          placeholder={t('password-placeholder')}
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
        <Button variant="solid" color="primary" type="submit">
          {t('send')}
        </Button>
      </div>
    </form>
  )
}
