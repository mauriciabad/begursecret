'use client'

import { Select, SelectItem, type SelectProps } from '@nextui-org/select'
import { useLocale } from 'next-intl'
import { forwardRef } from 'react'
import { PlaceCategoryIcon } from '~/components/icons/place-category-icon'
import { onlyTranslatableLocales } from '~/i18n'
import { trpc } from '~/trpc'

type Props = Omit<SelectProps, 'children'>

export const SelectCategory = forwardRef<HTMLSelectElement, Props>(
  ({ selectedKeys, ...selectProps }, ref) => {
    const locale = useLocale()
    const { data: categories, isLoading: isLoadingCategories } =
      trpc.admin.places.listCategories.useQuery({
        locale: onlyTranslatableLocales(locale),
      })

    return (
      <Select
        classNames={{
          popoverContent: '[&>*]:max-h-[calc(50dvh-4rem)]',
        }}
        {...selectProps}
        selectedKeys={isLoadingCategories ? [] : selectedKeys}
        ref={ref}
        isLoading={isLoadingCategories}
        isDisabled={isLoadingCategories}
      >
        {(categories ?? []).map((category) => (
          <SelectItem
            key={category.id}
            value={category.id}
            startContent={
              <PlaceCategoryIcon
                icon={category.icon}
                size={20}
                stroke={1.5}
                className="text-default-700"
              />
            }
          >
            {category.name}
          </SelectItem>
        ))}
      </Select>
    )
  }
)
