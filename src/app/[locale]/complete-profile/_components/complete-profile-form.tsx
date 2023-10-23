'use client'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next-intl/client'
import { FC, FormEvent, useState } from 'react'
import { trpc } from '~/trpc'

export const CompleteProfileForm: FC<{
  className?: string
  userId: string
  defaultValues?: {
    name?: string
  }
}> = ({ className, userId, defaultValues = {} }) => {
  const t = useTranslations('profile.completeProfile')
  const router = useRouter()
  const [name, setName] = useState(defaultValues.name ?? '')
  const { update } = useSession()

  const completeProfile = trpc.profile.completeProfile.useMutation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      await completeProfile.mutateAsync({ name, userId })
      await update({ name })

      router.push('/profile')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <h1 className="mb-2 mt-8 text-center font-title text-3xl font-bold">
        {t('welcome')}
      </h1>
      <p className="mb-8 text-center">{t('description')}</p>

      <Input
        label={t('inputs.name')}
        variant="bordered"
        labelPlacement="outside"
        placeholder={t('inputs.name-placeholder')}
        type="text"
        value={name}
        onValueChange={setName}
      />

      {completeProfile.error && (
        <p className="mt-8 text-danger-700">{completeProfile.error.message}</p>
      )}

      <div className="flex flex-wrap justify-end gap-4">
        <Button
          className="mt-8"
          variant="solid"
          color="default"
          onPress={() => router.push('/profile')}
        >
          {t('cancel')}
        </Button>
        <Button
          className="mt-8 flex-grow"
          variant="solid"
          color="primary"
          type="submit"
        >
          {t('save')}
        </Button>
      </div>
    </form>
  )
}
