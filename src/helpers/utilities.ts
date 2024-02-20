import { F } from 'ts-toolbelt'

export const groupByKey = <
  T extends object,
  K extends string,
  R extends Record<string, T[]>,
>(
  array: T[],
  keys: F.AutoPath<T, K> | F.AutoPath<T, K>[],
  options?: { unique?: boolean }
): R => {
  const actualKeys = Array.isArray(keys) ? keys : [keys]
  const result = array.reduce((acc, value) => {
    actualKeys.forEach((key) => {
      const valueKey = (key
        .split('.')
        .reduce((nestedObject, k) => nestedObject?.[k], value as any)
        ?.toString() ?? undefined) as keyof R | undefined

      if (!valueKey) return

      acc[valueKey] ??= [] as unknown as R[keyof R]

      acc[valueKey].push(value)
    })

    return acc
  }, {} as R)

  if (options?.unique) {
    Object.keys(result).forEach((key) => {
      ;(result as Record<string, T[]>)[key] = Array.from(new Set(result[key]))
    })
  }

  return result
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
