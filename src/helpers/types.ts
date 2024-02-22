import {
  MessageKeys,
  NamespaceKeys,
  NestedKeyOf,
  NestedValueOf,
} from 'next-intl'

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & unknown

export type IntlMessageKeys<
  NestedKey extends NamespaceKeys<
    IntlMessages,
    NestedKeyOf<IntlMessages>
  > = never,
> = MessageKeys<
  NestedValueOf<
    {
      '!': IntlMessages
    },
    [NestedKey] extends [never] ? '!' : `!.${NestedKey}`
  >,
  NestedKeyOf<
    NestedValueOf<
      {
        '!': IntlMessages
      },
      [NestedKey] extends [never] ? '!' : `!.${NestedKey}`
    >
  >
>

/**
 * Get a union of all the keys of an object and its nested objects, joined by a dot.
 */
export type Paths<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}`
    }[keyof T]
  : never

/**
 * Get a union of all the keys of an object and its nested objects, joined by a dot.
 * But only the ones leading to a leaf node.
 */
export type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? '' : `.${Leaves<T[K]>}`}`
    }[keyof T]
  : never

export type ControlledInputProps<T = string | null | undefined> = {
  value?: T
  onChange?: (e: { target: { value: T } }) => void
  onBlur?: () => void
  isInvalid?: boolean
  errorMessage?: string
}
