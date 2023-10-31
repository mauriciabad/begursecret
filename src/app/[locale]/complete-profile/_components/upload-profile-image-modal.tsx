'use client'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { ChangeEvent, FC, FormEvent, useState } from 'react'
import { UploadProfileImageResponse } from '~/app/api/upload/profile-image/route'
import { AlertBox } from '~/components/alert-box'
import { UpdateSessionSchemaType } from '~/schemas/profile'

const uploadProfileImage = async ({ file }: { file: File | null }) => {
  const body = new FormData()

  if (file) body.set('image', file)

  const response = await fetch('/api/upload/profile-image', {
    method: 'POST',
    body,
  })

  if (!response.ok) {
    throw new Error('Error uploading profile image')
  }

  const result: UploadProfileImageResponse = await response.json()
  if (!result) throw new Error('Error uploading profile image')
  return result
}

export const UploadProfileImageModal: FC<{
  className?: string
}> = ({ className }) => {
  const t = useTranslations('profile.completeProfile')
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [file, setFile] = useState<File | null>(null)
  const { update } = useSession()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // TODO: Remove when issue gets solved
    // https://github.com/axiomhq/next-axiom/pull/162
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { imageUrl } = await uploadProfileImage({ file })

    const updateData: UpdateSessionSchemaType = { picture: imageUrl }
    await update(updateData)

    onClose()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) setFile(selectedFile)
  }

  return (
    <>
      <Button onPress={onOpen} variant="bordered" className={className}>
        {t('change-profile-image')}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <form onSubmit={handleSubmit}>
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="font-title">{t('change-profile-image')}</h2>
                </ModalHeader>

                <ModalBody>
                  <Input
                    type="file"
                    label={t('inputs.profile-image')}
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder={t('inputs.profile-image-placeholder')}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <AlertBox type="info">
                    {t('leave-empty-to-remove-profile-image')}
                  </AlertBox>
                </ModalBody>

                <ModalFooter>
                  <Button
                    className="flex-grow"
                    variant="solid"
                    color="primary"
                    type="submit"
                    fullWidth
                  >
                    {t('save')}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}
