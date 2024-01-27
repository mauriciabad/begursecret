'use client'

import { Button } from '@nextui-org/button'
import { Image } from '@nextui-org/image'
import { Input } from '@nextui-org/input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal'
import { useTranslations } from 'next-intl'
import { ChangeEvent, FC, HTMLProps, useState } from 'react'
import type { UploadPlaceImageResponse } from '~/app/api/upload/place-image/route'
import { AlertBox } from '~/components/generic/alert-box'
import { cn } from '~/helpers/cn'
import { makeImageUrl } from '~/helpers/images'
import { uploadImage } from '~/helpers/upload-images'

export const UploadPlaceImageModal: FC<
  HTMLProps<HTMLInputElement> & {
    className?: string
    label: string
    defaultValue?: string | null
    isInvalid?: boolean
    errorMessage?: string
  }
> = ({
  className,
  defaultValue,
  label,
  isInvalid,
  errorMessage,
  ...inputProps
}) => {
  const t = useTranslations('admin-places')
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [file, setFile] = useState<File | null>(null)
  const [mainImage, setMainImage] = useState<string | null>(
    defaultValue || null
  )

  const uploadNewImage = async () => {
    const { imageKey } = await uploadImage<UploadPlaceImageResponse>({
      file,
      endpoint: '/api/upload/place-image',
    })

    setMainImage(imageKey)

    onClose()
  }

  const removeImage = () => {
    setMainImage(null)
    onClose()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) setFile(selectedFile)
  }

  return (
    <>
      <input
        {...inputProps}
        value={mainImage ?? ''}
        type="hidden"
        className="hidden"
        aria-hidden
      />
      <div className="flex flex-col items-center gap-1">
        <div className="font-title">{label}</div>
        <Image
          radius="md"
          alt={t('columns.mainImage')}
          className={cn('w-full max-w-64', {
            'border-2 border-red-500': isInvalid,
          })}
          src={makeImageUrl(mainImage)}
        />
        <Button onPress={onOpen} variant="bordered" className={className}>
          {t('change-image.change-main-image')}
        </Button>

        {errorMessage && (
          <AlertBox type="error" className="mt-2">
            {errorMessage}
          </AlertBox>
        )}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="font-title">
                  {t('change-image.change-main-image')}
                </h2>
              </ModalHeader>

              <ModalBody>
                <Input
                  type="file"
                  label={t('change-image.upload-new-image')}
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder=" "
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </ModalBody>

              <ModalFooter>
                <Button
                  className="flex-grow"
                  variant="solid"
                  fullWidth
                  onPress={removeImage}
                >
                  {t('change-image.remove-image')}
                </Button>
                <Button
                  className="flex-grow"
                  variant="solid"
                  color="primary"
                  fullWidth
                  onPress={uploadNewImage}
                >
                  {t('change-image.save')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
