'use client'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next-intl/client'
import { FC, FormEvent, useState } from 'react'
import { LinkButton } from '~/components/link-button'
import { UserAvatar } from '~/components/user-avatar'
import { UpdateSessionSchemaType } from '~/schemas/profile'
import { trpc } from '~/trpc'
import { UploadProfileImageModal } from './upload-profile-image-modal'

export const CompleteProfileForm: FC<{
  className?: string
  defaultValues?: {
    name?: string
  }
}> = ({ className, defaultValues = {} }) => {
  const { update, data: session } = useSession()
  const router = useRouter()
  if (!session) {
    router.push('/profile')
    return
  }

  const t = useTranslations('profile.completeProfile')
  const [name, setName] = useState(defaultValues.name ?? '')
  const completeProfile = trpc.profile.completeProfile.useMutation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    await completeProfile.mutateAsync({ name })
    const updateData: UpdateSessionSchemaType = { name }
    await update(updateData)

    router.push('/profile')
    router.refresh()
  }

  return (
    <>
      <div className={className}>
        <h1 className="mb-2 mt-8 text-center font-title text-3xl font-bold">
          {t('welcome')}
        </h1>
        <p className="mb-8 text-center">{t('description')}</p>

        <div className="mb-4 flex flex-col items-center gap-1">
          <UserAvatar
            user={session.user}
            className="mx-auto mb-2 block h-24 w-24"
          />
          <UploadProfileImageModal />
        </div>

        <form onSubmit={handleSubmit}>
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
            <p className="mt-8 text-danger-700">
              {completeProfile.error.message}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-4">
            <LinkButton
              href="/profile"
              className="mt-8"
              variant="solid"
              color="default"
            >
              {t('cancel')}
            </LinkButton>
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
      </div>
    </>
  )
}
