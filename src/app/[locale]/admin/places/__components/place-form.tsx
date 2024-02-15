'use client'

import { Checkbox } from '@nextui-org/checkbox'
import { Input, Textarea } from '@nextui-org/input'
import { useTranslations } from 'next-intl'
import { FC, useState } from 'react'
import { Controller } from 'react-hook-form'
import { FeaturesEditor } from '~/components/admin-only/features-editor'
import { SelectCategory } from '~/components/admin-only/select-category'
import { MarkdownEditor } from '~/components/generic/markdown-editor'
import {
  SafeForm,
  SafeSubmitButton,
  useSafeForm,
} from '~/components/generic/safe-form'
import { MapPointSelector } from '~/components/map/map-point-selector'
import { cn } from '~/helpers/cn'
import { useRouter } from '~/navigation'
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
          location: `${place.location.lat}, ${place.location.lng}`,
          mainImageId: place.mainImage?.id ?? undefined,
          content: place.content ?? undefined,
          features: place.features,
        }
      : {
          name: undefined,
          description: undefined,
          mainCategory: undefined,
          categories: '',
          location: undefined,
          mainImageId: undefined,
          content: undefined,
          features: undefined,
        },
  })

  const [stayOnPage, setStayOnPage] = useState(false)

  const isCreateForm = !place

  return (
    <>
      <h1 className="text-2xl font-bold">
        {isCreateForm ? t('create-place') : t('edit-place')}
      </h1>
      <p className="text-lg text-red-500">CATALAN ONLY</p>

      <SafeForm
        form={form}
        handleSubmit={async (values) => {
          if (isCreateForm) {
            await createPlaceMutation.mutateAsync(values)
          } else {
            await editPlaceMutation.mutateAsync({
              ...values,
              id: place.id,
            })
          }

          form.reset()

          if (!stayOnPage) {
            return router.push('/admin/places/')
          }
        }}
        className={cn('space-y-4', className)}
      >
        <Controller
          name="name"
          control={form.control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <Input
              isInvalid={!!error}
              errorMessage={error?.message}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              label={t('columns.name')}
            />
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <Textarea
              isInvalid={!!error}
              errorMessage={error?.message}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              label={t('columns.description')}
            />
          )}
        />

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <Controller
            name="mainCategory"
            control={form.control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <SelectCategory
                isInvalid={!!error}
                errorMessage={error?.message}
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
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <SelectCategory
                isInvalid={!!error}
                errorMessage={error?.message}
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
          name="mainImageId"
          control={form.control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <UploadPlaceImageModal
              isInvalid={!!error}
              errorMessage={error?.message}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              label={t('columns.mainImage')}
            />
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="content"
            control={form.control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <MarkdownEditor
                isInvalid={!!error}
                errorMessage={error?.message}
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                label={t('columns.content')}
              />
            )}
          />

          <div className="relative flex-1 basis-64">
            <Controller
              name="location"
              control={form.control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <MapPointSelector
                  isInvalid={!!error}
                  errorMessage={error?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  label={t('columns.location')}
                />
              )}
            />
          </div>
        </div>

        <FeaturesEditor label={t('columns.features')} />

        <div className="mt-8 flex items-center justify-start gap-4">
          <SafeSubmitButton color="primary" size="lg" />
          {isCreateForm && (
            <Checkbox isSelected={stayOnPage} onValueChange={setStayOnPage}>
              {t('stay-on-page-after-submit')}
            </Checkbox>
          )}
        </div>
      </SafeForm>
    </>
  )
}
