'use client'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react'
import {
  IconChevronDown,
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { FC, useCallback, useMemo, useState } from 'react'
import { OptimizedImage } from '~/components/generic/optimized-image'
import { PlaceCategoryIcon } from '~/components/icons/place-category-icon'
import { PlaceCategoryTagList } from '~/components/place-category-tags/place-category-tag-list'
import { cn } from '~/helpers/cn'
import { ApiRouterOutput } from '~/server/api/router'

type Category = ApiRouterOutput['admin']['places']['listCategories'][number]
type Place = ApiRouterOutput['admin']['places']['list'][number]

const columns = [
  {
    key: 'id',
    sortable: true,
    align: 'end',
  },
  {
    key: 'images',
    sortable: false,
    align: 'start',
  },
  {
    key: 'name',
    sortable: true,
    align: 'start',
  },
  {
    key: 'location',
    sortable: false,
    align: 'start',
  },
  {
    key: 'mainCategory',
    sortable: true,
    align: 'start',
  },
  {
    key: 'categories',
    sortable: false,
    align: 'start',
  },
  {
    key: 'actions',
    sortable: false,
    align: 'center',
  },
] as const satisfies {
  key: keyof Place | 'actions' | 'images'
  sortable: boolean
  align: 'center' | 'start' | 'end' | undefined
}[]

type Column = (typeof columns)[number]
type ColumnKey = Column['key']
type SortableColumnKey<T = Column> = T extends { sortable: true; key: infer ID }
  ? ID
  : never

const getSortValue = (item: Place, columnKey: SortableColumnKey) => {
  switch (columnKey) {
    case 'mainCategory':
      return item.mainCategory.name
    default:
      return item[columnKey]
  }
}

export const PlacesTable: FC<{
  places: Place[]
  categories: Category[]
  className?: string
}> = ({ className, places, categories }) => {
  const t = useTranslations('admin-places')

  const [filterValue, setFilterValue] = useState('')

  const [mainCategoryFilter, setMainCategoryFilter] = useState<Selection>(
    new Set()
  )
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  })

  const hasSearchFilter = Boolean(filterValue)

  const filteredItems = useMemo(() => {
    let filteredUsers = [...places]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((place) =>
        place.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    if (
      mainCategoryFilter !== 'all' &&
      mainCategoryFilter.size !== 0 &&
      mainCategoryFilter.size !== categories.length
    ) {
      filteredUsers = filteredUsers.filter((place) =>
        mainCategoryFilter.has(place.mainCategory.id.toString())
      )
    }

    return filteredUsers
  }, [places, filterValue, mainCategoryFilter])

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Place, b: Place) => {
      const columnKey = sortDescriptor.column as SortableColumnKey
      const first = getSortValue(a, columnKey)
      const second = getSortValue(b, columnKey)
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, filteredItems])

  const renderCell = useCallback((place: Place, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'images':
        return (
          <OptimizedImage
            image={{
              key: place.mainImage,
              width: 123,
              height: 123,
            }}
            radius="sm"
            className="max-w-12"
          />
        )
      case 'name':
        return (
          <>
            <p className="font-semibold">{place.name}</p>
            <p className="line-clamp-2 text-xs text-gray-600">
              {place.description}
            </p>
          </>
        )
      case 'location':
        return (
          <div className="flex flex-col">
            <p className="text-bold font-mono text-tiny text-default-400">
              {`${place.location.lat.toFixed(6)}, ${place.location.lng.toFixed(6)}`}
            </p>
          </div>
        )
      case 'mainCategory':
        return <PlaceCategoryTagList mainCategory={place.mainCategory} wrap />
      case 'categories':
        return (
          <PlaceCategoryTagList
            categories={place.categories.map((c) => c.category)}
            wrap
          />
        )
      case 'actions':
        return (
          <div className="relative flex items-center">
            <Tooltip content={t('actions.view')}>
              <Button
                href={`/explore/places/${place.id}`}
                as={Link}
                variant="light"
                radius="sm"
                isIconOnly
                className="h-unit-8 w-unit-8 min-w-unit-8 text-default-600"
              >
                <IconEye />
              </Button>
            </Tooltip>
            <Tooltip content={t('actions.edit')}>
              <Button
                href={`/admin/places/${place.id}`}
                as={Link}
                variant="light"
                radius="sm"
                isIconOnly
                className="h-unit-8 w-unit-8 min-w-unit-8 text-default-600"
              >
                <IconEdit />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content={t('actions.delete')}>
              <Button
                onPress={() => {
                  alert(t('delete-unsupported'))
                }}
                variant="light"
                radius="sm"
                isIconOnly
                color="danger"
                className="h-unit-8 w-unit-8 min-w-unit-8 text-default-600 hover:text-danger"
              >
                <IconTrash />
              </Button>
            </Tooltip>
          </div>
        )
      default:
        return place[columnKey]
    }
  }, [])

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value ?? '')
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className={cn('flex flex-col gap-4', className)}>
        <div className="flex flex-col-reverse items-end justify-between gap-3 xs:flex-row">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            classNames={{
              inputWrapper: 'h-unit-10',
            }}
            placeholder={t('search-placeholder')}
            startContent={<IconSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex items-center gap-3">
            <span className="hidden whitespace-nowrap text-right text-small text-default-400 sm:inline-block">
              {t('total', { total: sortedItems.length })}
            </span>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<IconChevronDown className="text-small" />}
                  variant="flat"
                >
                  {t('columns.mainCategory')}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                closeOnSelect={false}
                selectedKeys={mainCategoryFilter}
                selectionMode="multiple"
                onSelectionChange={setMainCategoryFilter}
              >
                {categories.map((category) => (
                  <DropdownItem
                    key={category.id}
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
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button
              href="/admin/places/new"
              as={Link}
              color="primary"
              endContent={<IconPlus />}
            >
              {t('add-new')}
            </Button>
          </div>
        </div>
      </div>
    )
  }, [
    filterValue,
    sortedItems,
    mainCategoryFilter,
    onSearchChange,
    hasSearchFilter,
  ])

  return (
    <Table
      selectionMode="single"
      selectionBehavior="replace"
      isHeaderSticky
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            align={column.align}
            allowsSorting={column.sortable}
            className="uppercase"
          >
            {t(`columns.${column.key}`)}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={t('no-places-found')} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as ColumnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
