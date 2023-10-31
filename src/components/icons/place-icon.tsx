import {
  Icon,
  IconBeach,
  IconBuildingCastle,
  IconCircle,
  IconFlag,
  TablerIconsProps,
} from '@tabler/icons-react'
import { FC } from 'react'
import { PlaceType } from '~/server/db/constants/places'

const iconsByPlaceType = {
  beach: IconBeach,
  monument: IconBuildingCastle,
  viewpoint: IconFlag,
} as const satisfies Record<PlaceType, Icon>

export const PlaceIcon: FC<
  TablerIconsProps & {
    type?: PlaceType
  }
> = ({ type, ...tablerIconsProps }) => {
  const Icon = type ? iconsByPlaceType[type] : IconCircle

  return <Icon {...tablerIconsProps} />
}
