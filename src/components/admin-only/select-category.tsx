'use client'

import { Select, SelectItem, type SelectProps } from '@nextui-org/select'
import { forwardRef } from 'react'
import { CategoryIcon } from '~/components/icons/category-icon'
import { IconName } from '~/server/db/constants/shared'

type Props = Omit<SelectProps, 'children'> & {
  categories: { id: number; name: string; icon: IconName }[]
  isLoading: boolean
}

export const SelectCategory = forwardRef<HTMLSelectElement, Props>(
  ({ selectedKeys, categories, isLoading, ...selectProps }, ref) => {
    return (
      <Select
        classNames={{
          popoverContent: '[&>*]:max-h-[calc(50dvh-4rem)]',
        }}
        {...selectProps}
        selectedKeys={isLoading ? [] : selectedKeys}
        ref={ref}
        isLoading={isLoading}
        isDisabled={isLoading}
      >
        {(categories ?? []).map((category) => (
          <SelectItem
            key={category.id}
            value={category.id}
            startContent={
              <CategoryIcon
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
