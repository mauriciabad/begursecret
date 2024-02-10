import {
  Icon,
  IconBeach,
  IconBuildingCastle,
  IconBuildingStore,
  IconBuildingTunnel,
  IconFishHook,
  IconFlag,
  IconFountain,
  IconHistory,
  IconHome,
  IconHomeOff,
  IconIcons,
  IconMapPin,
  IconMapPinQuestion,
  IconMountain,
  IconOvalVertical,
  IconParking,
  IconPennant,
  IconRipple,
  IconSailboat,
  IconScubaMask,
  IconTower,
  IconTrees,
  IconTrekking,
  IconWalk,
  TablerIconsProps,
} from '@tabler/icons-react'
import { FC } from 'react'
import { PlaceCategoryIcon as PlaceCategoryIconType } from '~/server/db/constants/places'

const iconsByIconName = {
  beach: IconBeach,
  flag: IconFlag,
  'scuba-mask': IconScubaMask,
  trees: IconTrees,
  'building-castle': IconBuildingCastle,
  'fish-hook': IconFishHook,
  fountain: IconFountain,
  mountain: IconMountain,
  ripple: IconRipple,
  parking: IconParking,
  history: IconHistory,
  trekking: IconTrekking,
  walk: IconWalk,
  'oval-vertical': IconOvalVertical,
  sailboat: IconSailboat,
  pennant: IconPennant,
  tower: IconTower,
  'home-off': IconHomeOff,
  home: IconHome,
  'building-tunnel': IconBuildingTunnel,
  'building-store': IconBuildingStore,
  icons: IconIcons,
  'map-pin-question': IconMapPinQuestion,
} as const satisfies Record<PlaceCategoryIconType, Icon>

export const PlaceCategoryIcon: FC<
  TablerIconsProps & {
    icon?: PlaceCategoryIconType | null
  }
> = ({ icon, ...tablerIconsProps }) => {
  const iconWithoutFallback =
    icon && icon in iconsByIconName ? iconsByIconName[icon] : null
  const Icon = iconWithoutFallback ?? IconMapPin

  return <Icon {...tablerIconsProps} />
}
