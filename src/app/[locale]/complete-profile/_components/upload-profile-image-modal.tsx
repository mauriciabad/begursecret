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

const uploadProfileImage = async ({
  file,
  userId,
}: {
  file: File
  userId: string
}) => {
  console.log('uploading profile image', file, userId)
  return 'https://picsum.photos/200'
}

export const UploadProfileImageModal: FC<{
  className?: string
  userId: string
}> = ({ className, userId }) => {
  const t = useTranslations('profile.completeProfile')
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [file, setFile] = useState<File | null>(null)
  const { update } = useSession()
  const updateProfileImage = trpc.profile.updateProfileImage.useMutation()
  // const getSignedUrlForUploadImage =
  //   trpc.profile.getSignedUrlForUploadImage.useFetch()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) throw new Error('No file selected')

    // TODO: Resize image to 256x256 with sharp

    // Get signed URL from S3
    // const signedUrl = await getSignedUrlForUploadImage()

    // Upload the image to S3
    const imageUrl = await uploadProfileImage({ file, userId })

    // Update the profile image on the DB (and replace old one)
    await updateProfileImage.mutateAsync({
      image: imageUrl,
      userId,
    })

    // Update the local session
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
