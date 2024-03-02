'use client'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import {
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table'
import { Tooltip } from '@nextui-org/tooltip'
import {
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC, useCallback, useMemo, useState } from 'react'
import { SelectRouteCategory } from '~/components/admin-only/select-route-category'
import { CategoryTagList } from '~/components/category-tags/category-tag-list'
import { MarkdownContent } from '~/components/generic/markdown-content'
import { PlaceMarker } from '~/components/generic/place-marker'
import { cn } from '~/helpers/cn'
import { ColumnsArray, makeCompareFn } from '~/helpers/tables'
import { Link } from '~/navigation'
import { ApiRouterOutput } from '~/server/api/router'

type Route = ApiRouterOutput['admin']['routes']['list'][number]

const columns = [
  {
    key: 'id',
    sortable: true,
    align: 'end',
  },
  {
    key: 'importance',
    sortable: true,
    align: 'end',
  },
  {
    key: 'name',
    sortable: true,
    align: 'start',
  },
  {
    key: 'categories',
    sortable: true,
    align: 'start',
  },
  {
    key: 'images',
    sortable: true,
    align: 'center',
  },
  {
    key: 'description',
    sortable: true,
    align: 'start',
  },
  {
    key: 'content',
    sortable: true,
    align: 'start',
  },
  {
    key: 'missingInfo',
    sortable: true,
    align: 'center',
  },
  {
    key: 'actions',
    sortable: false,
    align: 'center',
  },
] as const satisfies ColumnsArray

type ColumnKey = (typeof columns)[number]['key']

export const RoutesTable: FC<{
  routes: Route[]
  className?: string
}> = ({ className, routes }) => {
  const t = useTranslations('admin-places-and-routes')

  const [filterValue, setFilterValue] = useState('')

  const [mainCategoryFilter, setMainCategoryFilter] = useState<Selection>(
    new Set()
  )
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'importance',
    direction: 'ascending',
  })

  const hasSearchFilter = Boolean(filterValue)

  const filteredItems = useMemo(() => {
    let filteredUsers = [...routes]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((route) =>
        route.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    if (mainCategoryFilter !== 'all' && mainCategoryFilter.size !== 0) {
      filteredUsers = filteredUsers.filter((route) =>
        mainCategoryFilter.has(route.mainCategory.id.toString())
      )
    }

    return filteredUsers
  }, [routes, filterValue, mainCategoryFilter])

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort(
      makeCompareFn(
        {
          mainCategory: (item) => item.mainCategory.name,
        },
        sortDescriptor,
        columns
      )
    )
  }, [sortDescriptor, filteredItems])

  const renderCell = useCallback((route: Route, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'name':
        return (
          <span className="font-semibold">
            <PlaceMarker
              color={route.mainCategory.color}
              icon={route.mainCategory.icon}
              className="mr-2 inline-block align-middle"
              size="md"
            />
            {route.name}
          </span>
        )
      case 'description':
        return route.description ? (
          <Tooltip content={route.description}>
            <span>✔</span>
          </Tooltip>
        ) : (
          '❌'
        )
      case 'content':
        return route.content ? (
          <Tooltip content={<MarkdownContent content={route.content} />}>
            <span>✔</span>
          </Tooltip>
        ) : (
          '❌'
        )
      case 'images':
        return route.mainImage?.id ? null : '❌'
      case 'missingInfo':
        return route.features.hasMissingInfoNotes ? (
          <Tooltip content={route.features.hasMissingInfoNotes}>
            <span>
              {route.features.hasMissingInfo === null
                ? '?'
                : route.features.hasMissingInfo
                  ? '❌'
                  : '✔'}
            </span>
          </Tooltip>
        ) : (
          route.features.hasMissingInfo !== null &&
            (route.features.hasMissingInfo ? '❌' : '✔')
        )
      case 'categories':
        return (
          <CategoryTagList
            mainCategory={route.mainCategory}
            categories={route.categories.map((c) => c.category)}
            wrap
          />
        )
      case 'actions':
        return (
          <div className="relative flex items-center">
            <Tooltip content={t('actions.view')}>
              <Button
                href={`/explore/routes/${route.id}`}
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
                href={`/admin/routes/${route.id}`}
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
        return route[columnKey]
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
          <div className="flex flex-1 items-center justify-end gap-3">
            <span className="hidden whitespace-nowrap text-right text-small text-default-400 sm:inline-block">
              {t('total', { total: sortedItems.length })}
            </span>
            <SelectRouteCategory
              onSelectionChange={setMainCategoryFilter}
              selectedKeys={mainCategoryFilter}
              label={t('tableColumns.categories')}
              selectionMode="multiple"
              size="sm"
              className="max-w-64"
            />

            <Button
              href="/admin/routes/new"
              as={Link}
              color="primary"
              endContent={<IconPlus className="flex-shrink-0" />}
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
            {t(`tableColumns.${column.key}`)}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={t('nothing-found')} items={sortedItems}>
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
