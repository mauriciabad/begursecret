'use client'

import { Button } from '@nextui-org/button'
import { Checkbox } from '@nextui-org/checkbox'
import { Input, Textarea } from '@nextui-org/input'
import { IconExternalLink } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC, useState } from 'react'
import { Controller } from 'react-hook-form'
import { FeaturesEditor } from '~/components/admin-only/features-editor'
import { SelectRouteCategory } from '~/components/admin-only/select-route-category'
import { MarkdownEditor } from '~/components/generic/markdown-editor'
import {
  SafeForm,
  SafeSubmitButton,
  useSafeForm,
} from '~/components/generic/safe-form'
import { cn } from '~/helpers/cn'
import { multiLineToGeoJsonString } from '~/helpers/spatial-data/multi-line'
import { Link, useRouter } from '~/navigation'
import { createRouteSchema } from '~/schemas/routes'
import { ApiRouterOutput } from '~/server/api/router'
import { trpc } from '~/trpc'

type Route = NonNullable<ApiRouterOutput['admin']['routes']['get']>

export const RouteForm: FC<{
  route?: Route
  className?: string
}> = ({ className, route }) => {
  const t = useTranslations('admin-places-and-routes')
  const router = useRouter()

  const utils = trpc.useUtils()
  const createRouteMutation = trpc.admin.routes.createRoute.useMutation({
    onSuccess() {
      utils.admin.routes.list.invalidate()
      utils.admin.routes.get.invalidate()
    },
  })
  const editRouteMutation = trpc.admin.routes.editRoute.useMutation({
    onSuccess() {
      utils.admin.routes.list.invalidate()
      utils.admin.routes.get.invalidate()
    },
  })

  const form = useSafeForm({
    schema: createRouteSchema,
    defaultValues: route
      ? {
          name: route.name,
          description: route.description ?? undefined,
          mainCategory: route.mainCategory.id,
          categories: route.categories.map((c) => c.category.id).join(','),
          path: multiLineToGeoJsonString(route.path),
          content: route.content ?? undefined,
          features: route.features,
        }
      : {
          name: undefined,
          description: undefined,
          mainCategory: undefined,
          categories: '',
          path: undefined,
          content: undefined,
          features: {},
        },
  })

  const [stayOnPage, setStayOnPage] = useState(false)

  const isCreateForm = !route

  return (
    <>
      <h1 className="text-2xl font-bold">
        {isCreateForm ? t('create') : t('edit')}
      </h1>
      <p className="text-lg text-red-500">CATALAN ONLY</p>

      <SafeForm
        form={form}
        handleSubmit={async (values) => {
          if (isCreateForm) {
            await createRouteMutation.mutateAsync(values)
          } else {
            await editRouteMutation.mutateAsync({
              ...values,
              id: route.id,
            })
          }

          form.reset()

          if (!isCreateForm || !stayOnPage) {
            return router.push('/admin/routes/')
          }
        }}
        className={cn('space-y-4', className)}
      >
        <div className="grid gap-4 sm:grid-cols-4 lg:grid-cols-5">
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
                className="sm:col-span-3 lg:col-span-4"
              />
            )}
          />
          <Controller
            name="importance"
            control={form.control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Input
                type="number"
                isInvalid={!!error}
                errorMessage={error?.message}
                onBlur={onBlur}
                onChange={onChange}
                value={value?.toString()}
                label={t('columns.importance')}
              />
            )}
          />
        </div>
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
              value={value ?? undefined}
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
              <SelectRouteCategory
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
              <SelectRouteCategory
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

          <div className="relative flex-1 basis-64 ">
            <Button
              as={Link}
              href="https://geojson.io/#map=13.26/41.95443/3.21328"
              endContent={<IconExternalLink />}
              className="mb-4"
              color="primary"
              target="_blank"
            >
              Open GeoJSON.io
            </Button>

            <Controller
              name="path"
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
                  label={t('columns.path')}
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
