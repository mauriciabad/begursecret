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
  User,
} from '@nextui-org/react'
import {
  IconChevronDown,
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react'
import Link from 'next-intl/link'
import { FC, useCallback, useMemo, useState } from 'react'
import { PlaceCategoryIcon } from '~/components/icons/place-category-icon'
import { PlaceCategoryTagList } from '~/components/place-category-tags/place-category-tag-list'
import { cn } from '~/helpers/cn'
import { makeImageUrl } from '~/helpers/images'
import { MapPoint } from '~/helpers/spatial-data'
import { PlaceCategoryIcon as PlaceCategoryIconType } from '~/server/db/constants/places'

type Category = {
  id: number
  icon: PlaceCategoryIconType | null
  name: string
}

type Place = {
  id: number
  mainImage: string | null
  location: MapPoint
  name: string
  description: string | null
  mainCategory: Category
  categories: {
    category: Category
  }[]
}

const columns = [
  {
    name: 'Id',
    uid: 'id',
    sortable: true,
    align: 'end',
  },
  {
    name: 'Name',
    uid: 'name',
    sortable: true,
    align: 'start',
  },
  {
    name: 'Location',
    uid: 'location',
    sortable: false,
    align: 'start',
  },
  {
    name: 'Main Category',
    uid: 'mainCategory',
    sortable: true,
    align: 'start',
  },
  {
    name: 'Categories',
    uid: 'categories',
    sortable: false,
    align: 'start',
  },
  {
    name: 'Actions',
    uid: 'actions',
    sortable: false,
    align: 'center',
  },
] as const satisfies {
  name: string
  uid: keyof Place | 'actions'
  sortable: boolean
  align: 'center' | 'start' | 'end' | undefined
}[]

type Column = (typeof columns)[number]
type ColumnKey = Column['uid']
type SortableColumnKey<T = Column> = T extends { sortable: true; uid: infer ID }
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
      case 'name':
        return (
          <User
            avatarProps={{
              classNames: {
                base: 'flex-shrink-0',
              },
              radius: 'sm',
              src: makeImageUrl(place.mainImage),
            }}
            description={
              <p className="line-clamp-2 max-w-[40ch]">{place.description}</p>
            }
            name={place.name}
          >
            {place.name}
          </User>
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
            <Tooltip content="View">
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
            <Tooltip content="Edit">
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
            <Tooltip color="danger" content="Delete">
              <Button
                onPress={() => {
                  alert('Delete')
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
    if (value) {
      setFilterValue(value)
    } else {
      setFilterValue('')
    }
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
            placeholder="Search by name..."
            startContent={<IconSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex items-center gap-3">
            <span className="hidden whitespace-nowrap text-right text-small text-default-400 sm:inline-block">
              Total {sortedItems.length}
            </span>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<IconChevronDown className="text-small" />}
                  variant="flat"
                >
                  Main Category
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Table Columns"
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
              Add New
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
            key={column.uid}
            align={column.align}
            allowsSorting={column.sortable}
            className="uppercase"
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No users found'} items={sortedItems}>
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
