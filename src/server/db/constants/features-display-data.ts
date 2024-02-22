import {
  Icon,
  IconAccessible,
  IconAccessibleOff,
  IconAlertTriangle,
  IconAlertTriangleFilled,
  IconArrowDownRight,
  IconBadgeWc,
  IconBarrierBlock,
  IconBus,
  IconBusOff,
  IconCar,
  IconCertificate,
  IconClock,
  IconCoinEuro,
  IconCurrencyEuro,
  IconDimensions,
  IconDoorEnter,
  IconDoorExit,
  IconDropletOff,
  IconDroplets,
  IconFountain,
  IconFountainOff,
  IconFriends,
  IconGrain,
  IconLifebuoy,
  IconLifebuoyOff,
  IconMessageCheck,
  IconMessageReport,
  IconMoodSad,
  IconMoodSmile,
  IconParking,
  IconParkingOff,
  IconRulerMeasure,
  IconShirt,
  IconShirtOff,
  IconTicket,
  IconToiletPaperOff,
  IconToolsKitchen2,
  IconToolsKitchen2Off,
  IconUmbrella,
  IconWalk,
} from '@tabler/icons-react'
import { useMemo } from 'react'
import { Join } from 'ts-toolbelt/out/String/Join'
import { pick } from '~/helpers/utilities'
import {
  FeaturesInsert,
  FeaturesSelect,
  PriceUnit,
  allowedAccess,
  amountOfPeople,
  difficulty,
  groundType,
  placeToArriveFrom,
  priceUnit,
} from '~/server/db/constants/features'

const typeFeatureDisplay = <F extends AnyFeature<K>, K extends FeatureKey>(
  feature: F
) => feature

export const featureDisplayGroups = [
  {
    key: 'general',
    featureDisplays: [
      typeFeatureDisplay({
        type: 'boolean',
        key: 'isNudist',
        icon: IconShirtOff,
        icons: {
          true: IconShirtOff,
          false: IconShirt,
        },
      } as const),
      typeFeatureDisplay({
        type: 'composite',
        keys: ['price', 'priceUnit'],
        icon: IconCurrencyEuro,
        transformValues: ({ price, priceUnit }) => ({
          price,
          unit: priceUnit ?? ('eur' satisfies PriceUnit),
        }),
        showIf: ({ price }) => price !== null,
        moreInfoFeatureKey: 'priceNotes',
      } as const),
      typeFeatureDisplay({
        type: 'number',
        key: 'price',
        icon: IconCurrencyEuro,
        hidden: true,
      } as const),
      typeFeatureDisplay({
        type: 'enum',
        key: 'priceUnit',
        icon: IconCoinEuro,
        hidden: true,
        options: priceUnit,
      } as const),
      typeFeatureDisplay({
        type: 'enum',
        key: 'difficulty',
        icon: IconAccessible,
        icons: {
          accessible: IconAccessible,
          normal: IconAccessible,
          smallEffort: IconAccessibleOff,
          hard: IconAlertTriangle,
          dangerous: IconAlertTriangleFilled,
        },
        moreInfoFeatureKey: 'difficultyNotes',
        options: difficulty,
      } as const),
      typeFeatureDisplay({
        type: 'enum',
        key: 'amountOfPeople',
        icon: IconFriends,
        options: amountOfPeople,
      } as const),
      typeFeatureDisplay({
        type: 'enum',
        key: 'allowedAccess',
        icon: IconBarrierBlock,
        icons: {
          public: IconWalk,
          private: IconBarrierBlock,
          customers: IconBarrierBlock,
          permit: IconCertificate,
          permissive: IconWalk,
          mixed: IconBarrierBlock,
        },
        options: allowedAccess,
      } as const),
      typeFeatureDisplay({
        type: 'composite',
        keys: ['timeToArrive', 'placeToArriveFrom'],
        icon: IconWalk,
        transformValues: ({ timeToArrive, placeToArriveFrom }) => ({
          hours: timeToArrive && Math.floor(timeToArrive / 60),
          minutes: timeToArrive && timeToArrive % 60,
          placeToArriveFrom,
        }),
        showIf: ({ timeToArrive }) => timeToArrive !== null,
      } as const),
      typeFeatureDisplay({
        type: 'number',
        key: 'timeToArrive',
        icon: IconClock,
        hidden: true,
      } as const),
      typeFeatureDisplay({
        type: 'enum',
        key: 'placeToArriveFrom',
        icon: IconWalk,
        hidden: true,
        options: placeToArriveFrom,
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'isFreeWithLocalStamp',
        icon: IconTicket,
      } as const),
    ],
  },
  {
    key: 'features',
    featureDisplays: [
      typeFeatureDisplay({
        type: 'number',
        key: 'parkingSpaces',
        icon: IconCar,
      } as const),
      typeFeatureDisplay({
        type: 'number',
        key: 'duration',
        hidden: true,
        icon: IconClock,
      } as const),
      typeFeatureDisplay({
        type: 'composite',
        keys: ['duration'],
        hidden: true,
        transformValues: ({ duration }) => ({
          hours: Math.floor((duration ?? 0) / 60),
          minutes: (duration ?? 0) % 60,
        }),
        showIf: ({ duration }) => duration !== null,
        icon: IconClock,
      } as const),
      typeFeatureDisplay({
        type: 'number',
        key: 'distance',
        hidden: true,
        icon: IconRulerMeasure,
      } as const),
      typeFeatureDisplay({
        type: 'composite',
        keys: ['distance'],
        hidden: true,
        transformValues: ({ distance }) =>
          distance && distance >= 1000
            ? { distance: distance / 1000, unit: 'km' }
            : { distance: distance, unit: 'm' },
        icon: IconRulerMeasure,
      } as const),
      typeFeatureDisplay({
        type: 'number',
        key: 'slope',
        icon: IconArrowDownRight,
      } as const),
      typeFeatureDisplay({
        type: 'text',
        showRaw: true,
        key: 'dimensions',
        icon: IconDimensions,
      } as const),
      typeFeatureDisplay({
        type: 'enum',
        key: 'groundType',
        icon: IconGrain,
        options: groundType,
      }),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'isCovered',
        icon: IconUmbrella,
      } as const),
    ],
  },
  {
    key: 'services',
    featureDisplays: [
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasBus',
        icon: IconBus,
        icons: {
          true: IconBus,
          false: IconBusOff,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasParking',
        icon: IconParking,
        icons: {
          true: IconParking,
          false: IconParkingOff,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasToilet',
        icon: IconBadgeWc,
        icons: {
          true: IconBadgeWc,
          false: IconToiletPaperOff,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasShower',
        icon: IconDroplets,
        icons: {
          true: IconDroplets,
          false: IconDropletOff,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasLifeguard',
        icon: IconLifebuoy,
        icons: {
          true: IconLifebuoy,
          false: IconLifebuoyOff,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasDrinkingWater',
        icon: IconFountain,
        icons: {
          true: IconFountain,
          false: IconFountainOff,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasRestaurant',
        icon: IconToolsKitchen2,
        icons: {
          true: IconToolsKitchen2,
          false: IconToolsKitchen2Off,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasLeisure',
        icon: IconMoodSmile,
        icons: {
          true: IconMoodSmile,
          false: IconMoodSad,
        },
      } as const),
    ],
  },
  {
    key: 'other',
    featureDisplays: [
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasUnofficialName',
        icon: IconMessageReport,
        icons: {
          true: IconMessageReport,
          false: IconMessageCheck,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'isOutOfTheMunicipality',
        icon: IconDoorExit,
        icons: {
          true: IconDoorExit,
          false: IconDoorEnter,
        },
      } as const),
    ],
  },
  {
    key: 'notes',
    featureDisplays: [
      typeFeatureDisplay({
        type: 'markdown',
        key: 'priceNotes',
        icon: IconCurrencyEuro,
      } as const),
      typeFeatureDisplay({
        type: 'markdown',
        key: 'difficultyNotes',
        icon: IconAccessible,
      } as const),
      typeFeatureDisplay({
        type: 'markdown',
        key: 'allowedAccessNotes',
        icon: IconBarrierBlock,
      } as const),
    ],
  },
] as const satisfies {
  key: keyof IntlMessages['data']['features']['titles']
  featureDisplays: AnyFeature[]
}[]

export function getIconForFeature<F extends EnumFeature | BooleanFeature>(
  featureDisplay: F,
  value: string | boolean | null | undefined
) {
  if (value === undefined || value === null) return featureDisplay.icon
  if (featureDisplay.icons)
    return featureDisplay.icons[`${value}` as keyof typeof featureDisplay.icons]
  return featureDisplay.icon
}

export function getCompositeFeatureKey<Keys extends Array<string>>(keys: Keys) {
  return keys.join('-') as Join<Keys, '-'>
}

function getCompositeFeatureRawValues<T extends CompositeFeature>(
  featureDisplay: T,
  features: Features
) {
  return pick(features, featureDisplay.keys) as Parameters<
    NonNullable<T['transformValues']>
  >[0]
}

function shouldShow<T extends CompositeFeature>(
  featureDisplay: T,
  rawValues: Parameters<NonNullable<T['transformValues']>>[0]
) {
  if (!featureDisplay.showIf) return true
  return featureDisplay.showIf(rawValues)
}

export function getCompositeFeatureValues<T extends CompositeFeature>(
  featureDisplay: T,
  features: Features
) {
  const rawValues = getCompositeFeatureRawValues(featureDisplay, features)
  if (!shouldShow(featureDisplay, rawValues)) return null

  if (!featureDisplay?.transformValues) return rawValues
  return featureDisplay?.transformValues(rawValues)
}

export function useFeatureDisplay(features: Features | null | undefined) {
  const allValuesNullInGroup = useMemo(() => {
    return Object.fromEntries(
      featureDisplayGroups.map((group) => [
        group.key,
        group.featureDisplays.every(featureDisplayIsEmpty),
      ])
    ) as Record<(typeof featureDisplayGroups)[number]['key'], boolean>
  }, [features])

  const allValuesNull = useMemo(() => {
    return featureDisplayGroups.every(
      (group) => allValuesNullInGroup[group.key]
    )
  }, [allValuesNullInGroup])

  function getMoreInfoContent(featureDisplay: AnyFeature) {
    if (!features) return null
    if (!('moreInfoFeatureKey' in featureDisplay)) return null
    if (!featureDisplay.moreInfoFeatureKey) return null

    return features[featureDisplay.moreInfoFeatureKey]
  }

  function featureDisplayIsEmpty(featureDisplay: AnyFeature) {
    if (!features) return true

    if ('hidden' in featureDisplay && featureDisplay.hidden) {
      return true
    }

    if (featureDisplay.type === 'composite') {
      const rawValues = getCompositeFeatureRawValues(featureDisplay, features)
      return !shouldShow(featureDisplay, rawValues)
    }

    return (
      features[featureDisplay.key] === null ||
      features[featureDisplay.key] === undefined
    )
  }

  return {
    allValuesNull,
    allValuesNullInGroup,
    getMoreInfoContent,
    featureDisplayIsEmpty,
  }
}

// ------------------- types -------------------

type Features = FeaturesInsert | FeaturesSelect

type FeatureKey = Exclude<keyof Features, 'id'>

type FeaturesKeysOfType<T> = {
  [K in FeatureKey]: NonNullable<Features[K]> extends T ? K : never
}[FeatureKey]

type NumberFeature<K extends FeatureKey = FeatureKey> = {
  type: 'number'
  key: K
  hidden?: boolean
  icon: Icon
  moreInfoFeatureKey?: FeaturesKeysOfType<string>
  showRaw?: boolean
}

type TextFeature<K extends FeatureKey = FeatureKey> = {
  type: 'text'
  key: K
  hidden?: boolean
  icon: Icon
  moreInfoFeatureKey?: FeaturesKeysOfType<string>
  showRaw?: boolean
}

type MarkdownFeature<K extends FeatureKey = FeatureKey> = {
  type: 'markdown'
  key: K
  hidden?: boolean
  icon: Icon
}

type EnumFeature<
  K extends FeaturesKeysOfType<string> = FeaturesKeysOfType<string>,
> = {
  type: 'enum'
  key: K
  hidden?: boolean
  moreInfoFeatureKey?: FeaturesKeysOfType<string>
  options: readonly NonNullable<Features[K]>[]
  icon: Icon
  icons?: { [IconKey in NonNullable<Features[K]>]: Icon }
}

type BooleanFeature<
  K extends FeaturesKeysOfType<boolean> = FeaturesKeysOfType<boolean>,
> = {
  type: 'boolean'
  key: K
  hidden?: boolean
  moreInfoFeatureKey?: FeaturesKeysOfType<string>
  icon: Icon
  icons?: { true: Icon; false: Icon }
}

type CompositeFeature<K extends FeatureKey = FeatureKey> = {
  type: 'composite'
  keys: K[]
  icon: Icon
  transformValues?: (values: { [Keys in K]: Features[Keys] }) => Record<
    string,
    string | number | boolean | Date | null | undefined
  >
  showIf?: (values: { [Keys in K]: Features[Keys] }) => boolean
  moreInfoFeatureKey?: FeaturesKeysOfType<string>
}

type AnyFeature<K extends FeatureKey = FeatureKey> =
  | (K extends FeaturesKeysOfType<string>
      ? MarkdownFeature<K> | EnumFeature<K> | TextFeature<K>
      : K extends FeaturesKeysOfType<boolean>
        ? BooleanFeature<K>
        : NumberFeature<K>)
  | CompositeFeature<K>
