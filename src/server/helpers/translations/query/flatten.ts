export function flattenTranslations<T extends ValidType>(
  value: T
): SimpleType<T>
export function flattenTranslations<T>(value: T) {
  if (Array.isArray(value)) return value.map(flattenTranslations)

  if (isPlainObject(value)) {
    if ('translations' in value) {
      const { translations: translationsArray, ...rest } = value

      const translationsOverride = removeNulls(translationsArray?.[0] ?? {})

      return objectMap(
        { ...rest, ...translationsOverride },
        flattenTranslations
      )
    }
    return objectMap(value, flattenTranslations)
  }

  return value
}

// Return type could be improved, but it's good enough
function removeNulls<T extends Record<string, any>>(
  obj: T
): { [K in keyof T]?: NonNullable<T[K]> } {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName]
    }
  }
  return obj
}

function isPlainObject<
  O extends R | any,
  R extends Record<string | number | symbol, any>,
>(obj: O): obj is R {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    obj.constructor === Object &&
    Object.getPrototypeOf(obj) === Object.prototype
  )
}

interface Dictionary<T> {
  [key: string]: T
}

function objectMap<TValue, TResult>(
  obj: Dictionary<TValue>,
  valSelector: (val: TValue, obj: Dictionary<TValue>) => TResult,
  keySelector?: (key: string, obj: Dictionary<TValue>) => string,
  ctx?: Dictionary<TValue>
) {
  const ret = {} as Dictionary<TResult>
  for (const key of Object.keys(obj)) {
    const retKey = keySelector ? keySelector.call(ctx || null, key, obj) : key
    const retVal = valSelector.call(ctx || null, obj[key], obj)
    ret[retKey] = retVal
  }
  return ret
}

type ValidType = UntouchedType | ObjectType | ArrayType

type UntouchedType =
  | boolean
  | number
  | string
  | symbol
  | null
  | undefined
  | bigint
  | Date
type ObjectType = { [key in string]?: ValidType }
type ArrayType = ValidType[]

type IsAny<T> = unknown extends T & string ? true : false

type SimpleType<T extends ValidType> =
  IsAny<T> extends true
    ? any
    : T extends UntouchedType
      ? T
      : T extends [...infer Ar extends ValidType[]]
        ? { [Index in keyof Ar]: SimpleType<Ar[Index]> }
        : T extends ObjectType
          ? { [key in Exclude<keyof T, 'translations'>]: SimpleType<T[key]> }
          : T
