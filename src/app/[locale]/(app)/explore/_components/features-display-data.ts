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
import { Join } from 'ts-toolbelt/out/String/Join'
import { Features, PriceUnit } from '~/server/db/constants/features'

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
        type: 'enum',
        key: 'difficulty',
        icons: {
          accessible: IconAccessible,
          normal: IconAccessible,
          smallEffort: IconAccessibleOff,
          hard: IconAlertTriangle,
          dangerous: IconAlertTriangleFilled,
        },
        moreInfoFeatureKey: 'difficultyNotes',
      } as const),
      typeFeatureDisplay({
        type: 'enum',
        key: 'amountOfPeople',
        icon: IconFriends,
      } as const),
      typeFeatureDisplay({
        type: 'enum',
        key: 'groundType',
        icon: IconGrain,
      }),
      typeFeatureDisplay({
        type: 'raw',
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
        type: 'normal',
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
        icons: {
          true: IconBus,
          false: IconBusOff,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasParking',
        icons: {
          true: IconParking,
          false: IconParkingOff,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasToilet',
        icons: {
          true: IconBadgeWc,
          false: IconToiletPaperOff,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasShower',
        icons: {
          true: IconDroplets,
          false: IconDropletOff,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasLifeguard',
        icons: {
          true: IconLifebuoy,
          false: IconLifebuoyOff,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasDrinkingWater',
        icons: {
          true: IconFountain,
          false: IconFountainOff,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasRestaurant',
        icons: {
          true: IconToolsKitchen2,
          false: IconToolsKitchen2Off,
        },
      } as const),
      typeFeatureDisplay({
        type: 'boolean',
        key: 'hasLeisure',
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
        type: 'note',
        key: 'priceNotes',
        icon: IconCurrencyEuro,
      } as const),
      typeFeatureDisplay({
        type: 'note',
        key: 'difficultyNotes',
        icon: IconAccessible,
      } as const),
    ],
  },
] as const satisfies {
  key: string
  featureDisplays: AnyFeature[]
}[]

export function useFeaturesDisplayData(features: Features) {
  function getMoreInfoContent(featureDisplay: AnyFeature) {
    if (!('moreInfoFeatureKey' in featureDisplay)) return null
    if (!featureDisplay.moreInfoFeatureKey) return null

    return features[featureDisplay.moreInfoFeatureKey]
  }

  function getIconForEnumFeature(
    featureDisplay: EnumFeature,
    value: NonNullable<Features[EnumFeature['key']]>
  ) {
    if ('icon' in featureDisplay && featureDisplay.icon)
      return featureDisplay.icon

    return featureDisplay.icons[value]
  }

  function getIconForBooleanFeature(
    featureDisplay: BooleanFeature,
    value: boolean
  ) {
    if ('icon' in featureDisplay && featureDisplay.icon)
      return featureDisplay.icon

    return featureDisplay.icons[`${value}`]
  }

  function getCompositeFeatureKey<Keys extends Array<string>>(keys: Keys) {
    return keys.join('-') as Join<Keys, '-'>
  }

  return {
    getMoreInfoContent,
    getIconForEnumFeature,
    getIconForBooleanFeature,
    getCompositeFeatureKey,
  }
}

// ------------------- types -------------------

type FeatureKey = Exclude<keyof Features, 'id'>

type FeaturesKeysOfType<T> = {
  [K in FeatureKey]: NonNullable<Features[K]> extends T ? K : never
}[FeatureKey]

type NormalFeature<K extends FeatureKey = FeatureKey> = {
  type: 'normal'
  key: K
  icon: Icon
  moreInfoFeatureKey?: FeaturesKeysOfType<string>
}

type RawFeature<K extends FeatureKey = FeatureKey> = {
  type: 'raw'
  key: K
  icon: Icon
  moreInfoFeatureKey?: FeaturesKeysOfType<string>
}

type NoteFeature<K extends FeatureKey = FeatureKey> = {
  type: 'note'
  key: K
  icon: Icon
}

type EnumFeature<
  K extends FeaturesKeysOfType<string> = FeaturesKeysOfType<string>,
> = {
  type: 'enum'
  key: K
  moreInfoFeatureKey?: FeaturesKeysOfType<string>
} & (
  | { icon: Icon; icons?: never }
  | { icon?: never; icons: { [IconKey in NonNullable<Features[K]>]: Icon } }
)

type BooleanFeature<
  K extends FeaturesKeysOfType<boolean> = FeaturesKeysOfType<boolean>,
> = {
  type: 'boolean'
  key: K
  moreInfoFeatureKey?: FeaturesKeysOfType<string>
} & (
  | { icon: Icon; icons?: never }
  | { icon?: never; icons: { true: Icon; false: Icon } }
)

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
  | RawFeature
  | NormalFeature
  | BooleanFeature
  | CompositeFeature
  | NoteFeature
