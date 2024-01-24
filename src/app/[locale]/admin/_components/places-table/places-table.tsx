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
  User,
} from '@nextui-org/react'
import {
  IconChevronDown,
  IconDotsVertical,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react'
import { FC, useCallback, useMemo, useState } from 'react'
import { PlaceCategoryTagList } from '~/components/place-category-tags/place-category-tag-list'
import { cn } from '~/helpers/cn'
import { MapPoint } from '~/helpers/spatial-data'
import { PlaceCategoryIcon as PlaceCategoryIconType } from '~/server/db/constants/places'

type Place = {
  id: number
  mainImage: string | null
  location: MapPoint
  name: string
  description: string | null
  mainCategory: {
    id: number
    icon: PlaceCategoryIconType | null
    name: string
  }
  categories: {
    category: {
      id: number
      icon: PlaceCategoryIconType | null
      name: string
    }
  }[]
}

const columns = [
  { name: 'Id', uid: 'id', sortable: true },
  { name: 'Name', uid: 'name', sortable: true },
  { name: 'Location', uid: 'location', sortable: false },
  { name: 'Main Category', uid: 'mainCategory', sortable: true },
  { name: 'Categories', uid: 'categories', sortable: false },
  { name: 'Actions', uid: 'actions', sortable: false },
] as const satisfies {
  name: string
  uid: keyof Place | 'actions'
  sortable: boolean
}[]

type ColumnKey = (typeof columns)[number]['uid']

const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'name',
  'location',
  'mainCategory',
  'categories',
  'actions',
]

const mainCategoryOptions = [
  { name: 'Active', uid: 'active' },
  { name: 'Paused', uid: 'paused' },
  { name: 'Vacation', uid: 'vacation' },
] as const satisfies {
  name: string
  uid: string
}[]

export const PlacesTable: FC<{
  places: Place[]
  className?: string
}> = ({ className, places }) => {
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [mainCategoryFilter, setMainCategoryFilter] = useState<Selection>('all')
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'age',
    direction: 'ascending',
  })

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredUsers = [...places]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((place) =>
        place.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    if (
      mainCategoryFilter !== 'all' &&
      Array.from(mainCategoryFilter).length !== mainCategoryOptions.length
    ) {
      filteredUsers = filteredUsers.filter((place) =>
        Array.from(mainCategoryFilter).includes(place.mainCategory.id)
      )
    }

    return filteredUsers
  }, [places, filterValue, mainCategoryFilter])

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Place, b: Place) => {
      const first = a[sortDescriptor.column as keyof Place] as number
      const second = b[sortDescriptor.column as keyof Place] as number
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, filteredItems])

  const renderCell = useCallback((place: Place, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: place.mainImage ?? undefined }}
            description={place.description}
            name={place.name}
          >
            {place.name}
          </User>
        )
      case 'location':
        return (
          <div className="flex flex-col">
            <p className="text-bold font-mono text-tiny text-default-400">
              {`{ lat: ${place.location.lat}, lng: ${place.location.lng} }`}
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
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <IconDotsVertical className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            classNames={{
              inputWrapper: 'h-10',
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
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<IconChevronDown className="text-small" />}
                  variant="flat"
                >
                  MainCategory
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={mainCategoryFilter}
                selectionMode="multiple"
                onSelectionChange={setMainCategoryFilter}
              >
                {mainCategoryOptions.map((mainCategory) => (
                  <DropdownItem key={mainCategory.uid}>
                    {mainCategory.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<IconChevronDown className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid}>{column.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<IconPlus />}>
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
    visibleColumns,
    onSearchChange,
    hasSearchFilter,
  ])

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
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
