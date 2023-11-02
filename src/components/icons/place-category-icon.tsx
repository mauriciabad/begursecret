import {
  Icon,
  IconBeach,
  IconBuildingCastle,
  IconFishHook,
  IconFlag,
  IconFountain,
  IconHistory,
  IconMapPin,
  IconMountain,
  IconOvalVertical,
  IconParking,
  IconRipple,
  IconSailboat,
  IconScubaMask,
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
} as const satisfies Record<PlaceCategoryIconType, Icon>

export const PlaceCategoryIcon: FC<
  TablerIconsProps & {
    icon?: PlaceCategoryIconType | null
  }
> = ({ icon, ...tablerIconsProps }) => {
  const Icon = icon ? iconsByIconName[icon] : IconMapPin

  return <Icon {...tablerIconsProps} />
}
