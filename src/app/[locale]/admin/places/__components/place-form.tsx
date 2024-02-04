'use client'

import { Checkbox } from '@nextui-org/checkbox'
import { Input, Textarea } from '@nextui-org/input'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next-intl/client'
import { FC, useState } from 'react'
import { Controller } from 'react-hook-form'
import { SelectCategory } from '~/components/admin-only/select-category'
import { MarkdownEditor } from '~/components/generic/markdown-editor'
import {
  SafeForm,
  SafeSubmitButton,
  useSafeForm,
} from '~/components/generic/safe-form'
import { createPlaceSchema } from '~/schemas/places'
import { ApiRouterOutput } from '~/server/api/router'
import { trpc } from '~/trpc'
import { UploadPlaceImageModal } from './upload-place-image-modal'

type Place = NonNullable<ApiRouterOutput['admin']['places']['get']>

export const PlaceForm: FC<{
  place?: Place
  className?: string
}> = ({ className, place }) => {
  const t = useTranslations('admin-places')
  const router = useRouter()

  const utils = trpc.useUtils()
  const createPlaceMutation = trpc.admin.places.createPlace.useMutation({
    onSuccess() {
      utils.admin.places.list.invalidate()
      utils.admin.places.get.invalidate()
    },
  })
  const editPlaceMutation = trpc.admin.places.editPlace.useMutation({
    onSuccess() {
      utils.admin.places.list.invalidate()
      utils.admin.places.get.invalidate()
    },
  })

  const form = useSafeForm({
    schema: createPlaceSchema,
    defaultValues: place
      ? {
          name: place.name,
          description: place.description ?? undefined,
          mainCategory: place.mainCategory.id,
          categories: place.categories.map((c) => c.category.id).join(','),
          location: `${place.location.lat},${place.location.lng}`,
          mainImageId: place.mainImage?.id ?? undefined,
          content: place.content ?? undefined,
        }
      : {
          name: undefined,
          description: undefined,
          mainCategory: undefined,
          categories: '',
          location: undefined,
          mainImageId: undefined,
          content: undefined,
        },
  })

  const [stayOnPage, setStayOnPage] = useState(false)

  return (
    <>
      <h1 className="text-2xl font-bold">
        {place ? t('edit-place') : t('create-place')}
      </h1>
      <p className="text-lg text-red-500">CATALAN ONLY</p>

      <SafeForm
        form={form}
        handleSubmit={async (values) => {
          if (place) {
            await editPlaceMutation.mutateAsync({
              ...values,
              id: place.id,
            })
          } else {
            await createPlaceMutation.mutateAsync(values)
          }

          form.reset()

          if (!stayOnPage) {
            return router.push('/admin/places/')
          }
        }}
        className={className}
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              isInvalid={!!form.formState.errors['name']}
              errorMessage={form.formState.errors['name']?.message}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              className="mt-4"
              label={t('columns.name')}
            />
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Textarea
              isInvalid={!!form.formState.errors['name']}
              errorMessage={form.formState.errors['name']?.message}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              className="mt-4"
              label={t('columns.description')}
            />
          )}
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <Controller
            name="mainCategory"
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <SelectCategory
                isInvalid={!!form.formState.errors['mainCategory']}
                errorMessage={form.formState.errors['mainCategory']?.message}
                onBlur={onBlur}
                onChange={onChange}
                selectedKeys={value ? [String(value)] : []}
                label={t('columns.mainCategory')}
              />
            )}
          />

          <Controller
            name="categories"
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <SelectCategory
                isInvalid={!!form.formState.errors['categories']}
                errorMessage={form.formState.errors['categories']?.message}
                onBlur={onBlur}
                onChange={onChange}
                selectedKeys={value ? value.split(',') : []}
                label={t('columns.categories')}
                selectionMode="multiple"
                className="sm:col-span-2 lg:col-span-3"
              />
            )}
          />
        </div>

        <Controller
          name="location"
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              isInvalid={!!form.formState.errors['location']}
              errorMessage={form.formState.errors['location']?.message}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              className="mt-4"
              label={t('columns.location')}
              placeholder="Lat, Lng"
            />
          )}
        />

        <Controller
          name="mainImageId"
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <UploadPlaceImageModal
              isInvalid={!!form.formState.errors['mainImageId']}
              errorMessage={form.formState.errors['mainImageId']?.message}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              label={t('columns.mainImage')}
            />
          )}
        />

        <Controller
          name="content"
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <MarkdownEditor
              isInvalid={!!form.formState.errors['content']}
              errorMessage={form.formState.errors['content']?.message}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              label={t('columns.content')}
            />
          )}
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
