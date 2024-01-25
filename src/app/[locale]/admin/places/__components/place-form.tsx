'use client'

import { Input } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import {
  SafeForm,
  SafeSubmitButton,
  useSafeForm,
} from '~/components/generic/safe-form'
import { cn } from '~/helpers/cn'
import { createPlaceSchema } from '~/schemas/places'
import { PlaceCategoryIcon as PlaceCategoryIconType } from '~/server/db/constants/places'
import { trpc } from '~/trpc'

type Category = {
  id: number
  icon: PlaceCategoryIconType | null
  name: string
}

export const PlaceForm: FC<{
  categories: Category[]
  className?: string
}> = ({ className, categories }) => {
  const t = useTranslations('admin-places')

  const createPlaceMutation = trpc.admin.places.createPlace.useMutation()

  const { form, nextuiRegister } = useSafeForm({
    schema: createPlaceSchema,
    defaultValues: {
      name: undefined,
      description: undefined,
      mainCategory: undefined,
      categories: undefined,
      location: undefined,
    },
  })

  return (
    <>
      <h1 className="text-2xl font-bold">{t('create-place')}</h1>
      <p className="text-lg text-red-500">CATALAN ONLY</p>

      <SafeForm
        form={form}
        handleSubmit={async (values) => {
          await createPlaceMutation.mutateAsync(values)
          form.reset()
        }}
        className={cn(className)}
      >
        <Input
          {...nextuiRegister('name')}
          label={t('columns.name')}
          labelPlacement="outside"
        />
        <Input
          {...nextuiRegister('description')}
          label={t('columns.description')}
          labelPlacement="outside"
        />

        <Select
          {...nextuiRegister('mainCategory')}
          label={t('columns.mainCategory')}
          labelPlacement="outside"
        >
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </Select>
        {/* <Select
          {...nextuiRegister('categories')}
          label={t('columns.categories')}
          labelPlacement="outside"
          selectionMode="multiple"
        >
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </Select> */}
        <Input
          {...nextuiRegister('location')}
          label={t('columns.location')}
          labelPlacement="outside"
        />

        <SafeSubmitButton />
      </SafeForm>
    </>
  )
}
