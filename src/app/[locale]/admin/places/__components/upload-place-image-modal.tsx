'use client'

import { Button } from '@nextui-org/button'
import { Divider } from '@nextui-org/divider'
import { Input } from '@nextui-org/input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal'
import { Radio, RadioGroup } from '@nextui-org/radio'
import { useTranslations } from 'next-intl'
import { FC, useState } from 'react'
import { ControllerRenderProps } from 'react-hook-form'
import { UploadPlaceImageResponse } from '~/app/api/upload/place-image/route'
import { AlertBox } from '~/components/generic/alert-box'
import { InputFile } from '~/components/generic/input-file'
import { OptimizedImage } from '~/components/generic/optimized-image'
import { cn } from '~/helpers/cn'
import { uploadImage } from '~/helpers/upload-images'
import { trpc } from '~/trpc'

export const UploadPlaceImageModal: FC<
  Pick<
    ControllerRenderProps<{ mainImageId: number | undefined | null }>,
    'onBlur' | 'onChange' | 'value'
  > & {
    isInvalid?: boolean
    errorMessage?: string
    className?: string
    label: string
  }
> = ({
  className,
  label,
  isInvalid,
  errorMessage,
  onChange,
  onBlur,
  value: mainImageId,
}) => {
  const t = useTranslations('admin-places')
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [file, setFile] = useState<File | null>(null)
  const [selected, setSelected] = useState<string | undefined>(
    mainImageId?.toString() ?? undefined
  )
  const [uploadFileAlt, setUploadFileAlt] = useState<string>('')
  const [uploadFileSource, setUploadFileSource] = useState<string>('')
  const utils = trpc.useUtils()

  const updateValue = (value: number | null) => {
    setSelected(value?.toString() ?? undefined)
    onChange?.({
      target: { value },
    })
    onBlur?.()
  }

  const [isUploading, setIsUploading] = useState(false)

  const save = async () => {
    if (selected) {
      updateValue(Number(selected))
    } else {
      updateValue(null)
    }
    onClose()
  }

  const uploadNewImage = async () => {
    setIsUploading(true)
    try {
      const { image } = await uploadImage<UploadPlaceImageResponse>({
        file,
        alt: uploadFileAlt,
        source: uploadFileSource,
        endpoint: '/api/upload/place-image',
      })
      utils.admin.images.getAll.invalidate()

      updateValue(image.id)

      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    updateValue(null)
    onClose()
  }

  const { data: allImages, isLoading: isLoadingImages } =
    trpc.admin.images.getAll.useQuery()
  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <div className="font-title">{label}</div>
        <OptimizedImage
          radius="md"
          className={cn('min-h-32 w-full max-w-64', {
            'border-2 border-red-500': isInvalid,
          })}
          image={allImages?.find((image) => image.id === mainImageId)}
          isLoading={isLoadingImages}
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
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={!isUploading}
        scrollBehavior="inside"
        size="5xl"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="font-title">
                  {t('change-image.change-main-image')}
                </h2>
              </ModalHeader>

              <ModalBody>
                <div className="flex items-end gap-4">
                  <InputFile
                    type="images"
                    onValueChange={(files) => setFile(files[0] ?? null)}
                    isDisabled={isUploading}
                    isInvalid={isInvalid}
                    errorMessage={errorMessage}
                    label={t('change-image.upload-new-image')}
                    className="grow"
                  />
                  <Button
                    className="flex-grow"
                    variant="solid"
                    color="primary"
                    onPress={uploadNewImage}
                    isLoading={isUploading}
                    isDisabled={isUploading || !file}
                  >
                    {t('change-image.upload-and-save')}
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    onValueChange={setUploadFileAlt}
                    value={uploadFileAlt}
                    label={t('change-image.alt-text')}
                    variant="bordered"
                    placeholder=" "
                    labelPlacement="outside"
                    isDisabled={isUploading}
                  />
                  <Input
                    onValueChange={setUploadFileSource}
                    value={uploadFileSource}
                    label={t('change-image.source')}
                    variant="bordered"
                    placeholder=" "
                    labelPlacement="outside"
                    isDisabled={isUploading}
                  />
                </div>

                <Divider className="my-2" />

                <RadioGroup
                  label={t('change-image.select-existing-image')}
                  value={selected}
                  onValueChange={setSelected}
                  orientation="horizontal"
                  isDisabled={isUploading || isLoadingImages}
                  classNames={{
                    wrapper: cn(
                      'grid gap-2 items-start',
                      'grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                    ),
                  }}
                >
                  {allImages?.map((image) => (
                    <Radio
                      key={image.id}
                      value={String(image.id)}
                      classNames={{
                        base: cn(
                          'bg-content1 cursor-pointer relative p-1 m-0',
                          'hover:bg-content2',
                          'rounded-xl border-2 border-transparent',
                          'data-[selected=true]:border-primary'
                        ),
                        wrapper: cn(
                          'absolute top-2 right-2 m-0 z-10 bg-content1 rounded-full overflow-visible',
                          'before:border-content1 before:border-2 before:rounded-full before:absolute before:-inset-1 before:z-0'
                        ),
                        label: 'z-0 p-0',
                        labelWrapper: 'm-0 w-full',
                      }}
                    >
                      <OptimizedImage
                        className="h-auto w-full min-w-0"
                        image={image}
                        radius="sm"
                      />
                      {image.alt && (
                        <p className="mt-1 w-full px-2 text-xs text-gray-600">
                          {image.alt}
                        </p>
                      )}
                      {image.source && (
                        <p className="w-full truncate px-2 text-xs text-gray-400">
                          {image.source}
                        </p>
                      )}
                    </Radio>
                  ))}
                </RadioGroup>
              </ModalBody>

              <ModalFooter>
                <Button
                  className="flex-grow"
                  variant="solid"
                  fullWidth
                  onPress={removeImage}
                  isDisabled={isUploading}
                  isLoading={isUploading}
                >
                  {t('change-image.remove-image')}
                </Button>
                <Button
                  className="flex-grow"
                  variant="solid"
                  color="primary"
                  fullWidth
                  onPress={save}
                  isLoading={isUploading}
                  isDisabled={isUploading}
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
