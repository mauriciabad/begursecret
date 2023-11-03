import { Function, Object, String } from 'ts-toolbelt'

export const groupByKey = <
  O extends object,
  P extends string,
  PossibleNewKeys extends Object.Path<O, String.Split<P, '.'>>,
  NewKeys extends PossibleNewKeys extends string | number
    ? PossibleNewKeys
    : never,
  R extends { [key in NewKeys]: O[] },
>(
  array: O[],
  key: Function.AutoPath<O, P>
): R => {
  return array.reduce((acc, value) => {
    const valueKey = getByNestedKey(value, key)
    if (!(typeof valueKey === 'string' || typeof valueKey === 'number')) {
      return acc
    }
    ;(acc[valueKey] ??= []).push(value)
    return acc
  }, {} as R)
}

export function getByNestedKey<O extends object, P extends string>(
  object: O,
  path: Function.AutoPath<O, P>
): Object.Path<O, String.Split<P, '.'>> {
  return path.split('.').reduce((acc, key) => acc[key], object)
}
