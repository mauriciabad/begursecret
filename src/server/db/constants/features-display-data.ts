import {
  Icon,
  IconAccessible,
  IconAccessibleOff,
  IconAlertTriangle,
  IconAlertTriangleFilled,
  IconBadgeWc,
  IconBus,
  IconBusOff,
  IconCar,
  IconCarGarage,
  IconClock,
  IconCoinEuro,
  IconCurrencyEuro,
  IconDropletOff,
  IconDroplets,
  IconFountain,
  IconFountainOff,
  IconFriends,
  IconGrain,
  IconLifebuoy,
  IconLifebuoyOff,
  IconMoodSad,
  IconMoodSmile,
  IconParking,
  IconParkingOff,
  IconRulerMeasure,
  IconTicket,
  IconToiletPaperOff,
  IconToolsKitchen2,
  IconToolsKitchen2Off,
  IconWalk,
} from '@tabler/icons-react'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { Join } from 'ts-toolbelt/out/String/Join'
import {
  PriceUnit,
  amountOfPeople,
  difficulty,
  groundType,
  placeToArriveFrom,
  priceUnit,
} from '~/server/db/constants/features'
import { features } from '~/server/db/schema'

const typeFeatureDisplay = <F extends AnyFeature>(feature: F) => feature

export const featureDisplayGroups = [
  {
    key: 'features',
    featureDisplays: [
      typeFeatureDisplay({
        type: 'composite',
        keys: ['price', 'priceUnit'],
        icon: IconCurrencyEuro,
        transformValues: ({ price, priceUnit }) => ({
          price,
          priceUnit: priceUnit ?? ('eur' satisfies PriceUnit),
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
        key: 'groundType',
        icon: IconGrain,
        options: groundType,
      }),
      typeFeatureDisplay({
        type: 'text',
        showRaw: true,
        key: 'dimensions',
        icon: IconRulerMeasure,
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
        type: 'number',
        key: 'parkingSpaces',
        icon: IconCar,
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'isCovered',
        icon: IconCarGarage,
        moreInfoTranslationKey: true,
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'isFreeWithLocalStamp',
        icon: IconTicket,
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
    ],
  },
] as const satisfies {
  key: string
  featureDisplays: AnyFeature[]
}[]

export function getMoreInfoContent(
  featureDisplay: AnyFeature,
  features: Features | null | undefined
) {
  if (!features) return null
  if (!('moreInfoFeatureKey' in featureDisplay)) return null
  if (!featureDisplay.moreInfoFeatureKey) return null

  return features[featureDisplay.moreInfoFeatureKey]
}

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

// ------------------- types -------------------

type Features =
  | InferSelectModel<typeof features>
  | InferInsertModel<typeof features>

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

type AnyFeature =
  | EnumFeature
  | NumberFeature
  | TextFeature
  | BooleanFeature
  | CompositeFeature
  | MarkdownFeature