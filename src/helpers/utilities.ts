import { F } from 'ts-toolbelt'

export const groupByKey = <
  T extends object,
  K extends string,
  R extends Record<string, T[]>,
>(
  array: T[],
  key: F.AutoPath<T, K>
): R => {
  return array.reduce((acc, value) => {
    const valueKey = String(
      key
        .split('.')
        .reduce((nestedObject, k) => nestedObject?.[k], value as any)
    ) as keyof R

    acc[valueKey] ??= [] as unknown as R[keyof R]

    acc[valueKey].push(value)
    return acc
  }, {} as R)
}

export function pick<
  O extends Partial<Record<string, unknown>>,
  K2 extends string,
>(obj: O, keys: K2[]) {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key]
      return acc
    },
    {} as { [K in K2]: O[K] }
  )
}
