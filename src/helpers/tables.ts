import { SortDescriptor } from '@nextui-org/table'

export type SortableColumnKeys<
  T extends {
    key: string
    sortable: boolean
  }[],
> = T[number] extends { sortable: true; key: infer ID } ? ID : never

export type ColumnsArray<K extends string = string> = {
  key: K
  sortable: boolean
  align: 'center' | 'start' | 'end' | undefined
}[]

export function makeCompareFn<
  T,
  C extends { key: string; sortable: boolean }[],
  K1 = SortableColumnKeys<C>,
  K extends string = K1 extends unknown ? never : K1,
>(
  getSortValue: Record<
    K,
    (item: T) => string | number | null | undefined | boolean
  >,
  sortDescriptor: SortDescriptor,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _columns: C
) {
  return (a: T, b: T): -1 | 0 | 1 => {
    const columnKey = sortDescriptor.column as K | undefined
    if (!columnKey) return 0
    const first = getSortValue[columnKey]
      ? getSortValue[columnKey](a)
      : (a[columnKey as unknown as keyof T] as T[keyof T] | undefined)
    const second = getSortValue[columnKey]
      ? getSortValue[columnKey](b)
      : (b[columnKey as unknown as keyof T] as T[keyof T] | undefined)
    if (
      first === null ||
      second === null ||
      first === undefined ||
      second === undefined
    ) {
      return first === null || first === undefined ? +1 : -1
    }
    const cmp = first < second ? -1 : first > second ? 1 : 0

    return sortDescriptor.direction === 'descending'
      ? (-cmp as -1 | 0 | 1)
      : cmp
  }
}
