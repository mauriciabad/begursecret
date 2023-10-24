'use client'

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { useTranslations } from 'next-intl'
import { FC, useState, FormEvent, ChangeEvent } from 'react'
import { useSession } from 'next-auth/react'
import { trpc } from '~/trpc'
import { UpdateSessionSchemaType } from '~/schemas/profile'
import { PresignedPost } from 'aws-sdk/clients/s3'

const uploadProfileImage = async ({
  file,
  uploadUrl,
  fields,
}: {
  file: File
  uploadUrl: string
  fields: PresignedPost.Fields
}) => {
  const formData = new FormData()

  Object.entries({
    ...fields,
    file,
    'Content-Type': file.type,
  }).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload image')
  }

  const imageUrl = await response.text()

  return imageUrl
}

export const UploadProfileImageModal: FC<{
  className?: string
}> = ({ className }) => {
  const t = useTranslations('profile.completeProfile')
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [file, setFile] = useState<File | null>(null)
  const { update } = useSession()
  const updateProfileImage = trpc.profile.updateProfileImage.useMutation()
  const getSignedUrlForUploadImage =
    trpc.profile.getSignedUrlForUploadImage.useMutation()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) throw new Error('No file selected')

    // TODO: Resize image to 256x256 with sharp

    const { url: uploadUrl, fields } =
      await getSignedUrlForUploadImage.mutateAsync()

    const imageUrl = await uploadProfileImage({ file, uploadUrl, fields })

    await updateProfileImage.mutateAsync({
      image: imageUrl,
    })

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
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="font-title">{t('change-profile-image')}</h2>
              </ModalHeader>

              <ModalBody>
                <form onSubmit={handleSubmit}>
                  <Input
                    type="file"
                    label={t('inputs.profile-image')}
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder={t('inputs.profile-image-placeholder')}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <Button
                    className="mt-8 flex-grow"
                    variant="solid"
                    color="primary"
                    type="submit"
                    disabled={!file}
                  >
                    {t('save')}
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
