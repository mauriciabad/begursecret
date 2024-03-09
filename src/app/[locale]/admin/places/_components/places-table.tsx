'use client'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Pagination, Spinner } from '@nextui-org/react'
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
import { useLocale, useTranslations } from 'next-intl'
import { FC, useCallback, useMemo, useState } from 'react'
import { SelectPlaceCategory } from '~/components/admin-only/select-place-category'
import { CategoryTagList } from '~/components/category-tags/category-tag-list'
import { MarkdownContent } from '~/components/generic/markdown-content'
import { PlaceMarker } from '~/components/generic/place-marker'
import { cn } from '~/helpers/cn'
import { onlyTranslatableLocales } from '~/i18n'
import { Link } from '~/navigation'
import { ApiRouterOutput } from '~/server/api/router'
import { trpc } from '~/trpc'
import { ColumnsArray, makeCompareFn } from '../../../../../helpers/tables'

type Place = ApiRouterOutput['admin']['places']['list']['data'][number]

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

const rowsPerPage = 100

export const PlacesTable: FC<{
  className?: string
}> = ({ className }) => {
  const t = useTranslations('admin-places-and-routes')
  const locale = useLocale()

  const [page, setPage] = useState(1)
  const [filterValue, setFilterValue] = useState('')
  const [mainCategoryFilter, setMainCategoryFilter] = useState<Selection>(
    new Set()
  )

  const { data, isLoading } = trpc.admin.places.list.useQuery(
    {
      locale: onlyTranslatableLocales(locale),
      page,
      pageSize: rowsPerPage,
      query: filterValue,
      categoryId:
        mainCategoryFilter === 'all' || mainCategoryFilter.size === 0
          ? undefined
          : [...mainCategoryFilter].map(Number)[0],
    },
    {
      keepPreviousData: true,
    }
  )

  const pages = useMemo(() => {
    return data?.total ? Math.ceil(data.total / rowsPerPage) : 0
  }, [data, rowsPerPage])

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'importance',
    direction: 'ascending',
  })

  const sortedItems = useMemo(() => {
    if (!data) return []
    return [...data.data].sort(
      makeCompareFn(
        {
          categories: (item) => item.mainCategory.name,
          missingInfo: (item) => item.features.hasMissingInfo,
          images: (item) => Boolean(item.mainImage?.id),
          content: (item) => Boolean(item.content),
        },
        sortDescriptor,
        columns
      )
    )
  }, [sortDescriptor, data])

  const renderCell = useCallback((place: Place, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'name':
        return (
          <span className="font-semibold">
            <PlaceMarker
              color={place.mainCategory.color}
              icon={place.mainCategory.icon}
              className="mr-2 inline-block align-middle"
              size="md"
            />
            {place.name}
          </span>
        )
      case 'description':
        return place.description ? (
          <Tooltip content={place.description}>
            <span>✔</span>
          </Tooltip>
        ) : (
          '❌'
        )
      case 'content':
        return place.content ? (
          <Tooltip
            content={
              <MarkdownContent content={place.content} className="p-4" />
            }
          >
            <span>✔</span>
          </Tooltip>
        ) : (
          '❌'
        )
      case 'images':
        return place.mainImage?.id ? null : '❌'
      case 'missingInfo':
        return place.features.hasMissingInfoNotes ? (
          <Tooltip content={place.features.hasMissingInfoNotes}>
            <span>
              {place.features.hasMissingInfo === null
                ? '?'
                : place.features.hasMissingInfo
                  ? '❌'
                  : '✔'}
            </span>
          </Tooltip>
        ) : (
          place.features.hasMissingInfo !== null &&
            (place.features.hasMissingInfo ? '❌' : '✔')
        )
      case 'categories':
        return (
          <CategoryTagList
            mainCategory={place.mainCategory}
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
          <div className="flex flex-1 items-center justify-end gap-3">
            {data && (
              <span className="hidden whitespace-nowrap text-right text-small text-default-400 sm:inline-block">
                {t('total', { total: data?.total })}
              </span>
            )}
            <SelectPlaceCategory
              onSelectionChange={setMainCategoryFilter}
              selectedKeys={mainCategoryFilter}
              label={t('tableColumns.categories')}
              size="sm"
              className="max-w-64"
            />

            <Button
              href="/admin/places/new"
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
  }, [filterValue, sortedItems, mainCategoryFilter, onSearchChange])

  return (
    <Table
      selectionMode="single"
      selectionBehavior="replace"
      isHeaderSticky
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
      bottomContent={
        pages > 1 ? (
          <div className="flex w-full justify-center">
            <Pagination
              variant="light"
              showControls
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
            />
          </div>
        ) : null
      }
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
      <TableBody
        emptyContent={isLoading ? t('loading') : t('nothing-found')}
        items={sortedItems}
        loadingContent={<Spinner />}
        loadingState={isLoading ? 'loading' : 'idle'}
      >
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
