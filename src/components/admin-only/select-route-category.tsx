'use client'

import { type SelectProps } from '@nextui-org/select'
import { useLocale } from 'next-intl'
import { forwardRef } from 'react'
import { onlyTranslatableLocales } from '~/i18n'
import { trpc } from '~/trpc'
import { SelectCategory } from './select-category'

type Props = Omit<SelectProps, 'children'>

export const SelectRouteCategory = forwardRef<HTMLSelectElement, Props>(
  (selectProps, ref) => {
    const locale = useLocale()
    const { data: categories, isLoading } =
      trpc.admin.routes.listCategories.useQuery({
        locale: onlyTranslatableLocales(locale),
      })

    return (
      <SelectCategory
        categories={categories ?? []}
        isLoading={isLoading}
        ref={ref}
        {...selectProps}
      />
    )
  }
)
