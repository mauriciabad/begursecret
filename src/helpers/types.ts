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
