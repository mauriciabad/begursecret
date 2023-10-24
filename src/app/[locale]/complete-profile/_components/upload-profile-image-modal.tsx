'use client'

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { useTranslations } from 'next-intl'
import { FC, useState, FormEvent, ChangeEvent } from 'react'
import { useSession } from 'next-auth/react'
import { UpdateSessionSchemaType } from '~/schemas/profile'

const uploadProfileImage = async ({ file }: { file: File }) => {
  const body = new FormData()

  body.set('image', file)

  const response = await fetch('/api/upload/profile-image', {
    method: 'POST',
    body,
  })

  if (!response.ok) {
    throw new Error('Error uploading profile image')
  }

  const result: { imageUrl: string } = await response.json()

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

    if (!file) throw new Error('No file selected')

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
                </ModalBody>

                <ModalFooter>
                  <Button
                    className="flex-grow"
                    variant="solid"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={!file}
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
