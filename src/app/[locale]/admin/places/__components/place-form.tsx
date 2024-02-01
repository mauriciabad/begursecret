'use client'

import { Checkbox } from '@nextui-org/checkbox'
import { Input, Textarea } from '@nextui-org/input'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next-intl/client'
import { FC, useState } from 'react'
import { SelectCategory } from '~/components/admin-only/select-category'
import {
  SafeForm,
  SafeSubmitButton,
  useSafeForm,
} from '~/components/generic/safe-form'
import { createPlaceSchema } from '~/schemas/places'
import { trpc } from '~/trpc'
import { UploadPlaceImageModal } from './upload-place-image-modal'

export const PlaceForm: FC<{
  className?: string
}> = ({ className }) => {
  const t = useTranslations('admin-places')
  const router = useRouter()

  const createPlaceMutation = trpc.admin.places.createPlace.useMutation()

  const { form, nextuiRegister, noRefRegister } = useSafeForm({
    schema: createPlaceSchema,
    defaultValues: {
      name: undefined,
      description: undefined,
      mainCategory: undefined,
      categories: '',
      location: undefined,
      mainImage: undefined,
      content: undefined,
    },
  })

  const [stayOnPage, setStayOnPage] = useState(false)

  return (
    <>
      <h1 className="text-2xl font-bold">{t('create-place')}</h1>
      <p className="text-lg text-red-500">CATALAN ONLY</p>

      <SafeForm
        form={form}
        handleSubmit={async (values) => {
          await createPlaceMutation.mutateAsync(values)
          form.reset()

          if (!stayOnPage) {
            return router.push('/admin/places/')
          }
        }}
        className={className}
      >
        <Input
          {...nextuiRegister('name')}
          className="mt-4"
          label={t('columns.name')}
        />

        <Textarea
          {...nextuiRegister('description')}
          className="mt-4"
          label={t('columns.description')}
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <SelectCategory
            {...nextuiRegister('mainCategory')}
            label={t('columns.mainCategory')}
          />

          <SelectCategory
            {...nextuiRegister('categories')}
            label={t('columns.categories')}
            selectionMode="multiple"
            className="sm:col-span-2 lg:col-span-3"
          />
        </div>

        <Input
          {...nextuiRegister('location')}
          className="mt-4"
          label={t('columns.location')}
          placeholder="Lat, Lng"
        />

        <UploadPlaceImageModal
          {...noRefRegister('mainImage')}
          label={t('columns.mainImage')}
        />

        <Textarea
          {...nextuiRegister('content')}
          className="mt-4"
          label={t('columns.content')}
          description={t('markdown-supported')}
        />

        <div className="mt-8 flex items-center justify-start gap-4">
          <SafeSubmitButton color="primary" size="lg" />
          <Checkbox isSelected={stayOnPage} onValueChange={setStayOnPage}>
            {t('stay-on-page-after-submit')}
          </Checkbox>
        </div>
      </SafeForm>
    </>
  )
}
