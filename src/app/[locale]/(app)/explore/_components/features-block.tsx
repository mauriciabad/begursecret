import { Card } from '@nextui-org/card'
import {
  Icon,
  IconAccessible,
  IconAccessibleOff,
  IconAlertTriangle,
  IconAlertTriangleFilled,
  IconBadgeWc,
  IconBus,
  IconDroplets,
  IconFountain,
  IconFountainOff,
  IconFriends,
  IconGrain,
  IconLifebuoy,
  IconMoodSmile,
  IconParking,
  IconRulerMeasure,
  IconToolsKitchen2,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC, PropsWithChildren } from 'react'
import { cn } from '~/helpers/cn'
import { Features } from '~/server/db/constants/features'

export const FeaturesBlock: FC<{ features: Features; className?: string }> = ({
  features,
  className,
}) => {
  const t = useTranslations('explore.features')

  return (
    <Card className={cn('space-y-2 p-3', className)} radius="lg" shadow="sm">
      <FeatureList title={t('features')}>
        {features.difficulty === 'accessible' ? (
          <FeatureItem
            icon={IconAccessible}
            text={t('difficulty.accessible')}
          />
        ) : features.difficulty === 'smallEffort' ? (
          <FeatureItem
            icon={IconAccessibleOff}
            text={t('difficulty.smallEffort')}
          />
        ) : features.difficulty === 'hard' ? (
          <FeatureItem icon={IconAlertTriangle} text={t('difficulty.hard')} />
        ) : features.difficulty === 'dangerous' ? (
          <FeatureItem
            icon={IconAlertTriangleFilled}
            text={t('difficulty.dangerous')}
          />
        ) : null}

        {features.amountOfPeople && (
          <FeatureItem
            icon={IconFriends}
            text={t(`amount-of-people.${features.amountOfPeople}`)}
          />
        )}

        {features.groundType && (
          <FeatureItem
            icon={IconGrain}
            text={t(`ground-type.${features.groundType}`)}
          />
        )}

        {features.dimensions && (
          <FeatureItem icon={IconRulerMeasure} text={features.dimensions} />
        )}
      </FeatureList>

      <FeatureList title={t('services')}>
        {features.hasBus && (
          <FeatureItem icon={IconBus} text={t('bus-service')} />
        )}
        {features.hasParking && (
          <FeatureItem icon={IconParking} text={t('parking')} />
        )}
        {features.hasLifeguard && (
          <FeatureItem icon={IconLifebuoy} text={t('lifeguard')} />
        )}
        {features.hasToilet && (
          <FeatureItem icon={IconBadgeWc} text={t('toilet')} />
        )}
        {features.hasShower && (
          <FeatureItem icon={IconDroplets} text={t('showers')} />
        )}
        {features.hasRestaurant && (
          <FeatureItem icon={IconToolsKitchen2} text={t('restaurants')} />
        )}
        {features.hasLeisure && (
          <FeatureItem icon={IconMoodSmile} text={t('leisure-services')} />
        )}
        {features.hasDrinkingWater === true ? (
          <FeatureItem icon={IconFountain} text={t('drinking-water')} />
        ) : features.hasDrinkingWater === false ? (
          <FeatureItem icon={IconFountainOff} text={t('no-drinking-water')} />
        ) : null}
      </FeatureList>
    </Card>
  )
}

const FeatureItem: FC<{ icon: Icon; text: string }> = ({ icon, text }) => {
  const Icon = icon
  return (
    <li className="flex items-center gap-2">
      <Icon size={18} className="shrink-0 text-stone-800" />
      <span className="text-sm font-medium text-stone-800">{text}</span>
    </li>
  )
}

const FeatureList: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  return (
    <div>
      <h4 className="mb-1 font-bold leading-none">{title}</h4>
      <ul className="grid grid-cols-2 gap-2">{children}</ul>
    </div>
  )
}
