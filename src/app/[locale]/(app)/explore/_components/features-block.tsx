import { Card } from '@nextui-org/card'
import {
  Icon,
  IconAccessible,
  IconAccessibleOff,
  IconAlertTriangle,
  IconAlertTriangleFilled,
  IconBadgeWc,
  IconBus,
  IconBusOff,
  IconDropletOff,
  IconDroplets,
  IconFountain,
  IconFountainOff,
  IconFriends,
  IconGrain,
  IconLifebuoy,
  IconLifebuoyOff,
  IconMoodOff,
  IconMoodSmile,
  IconParking,
  IconParkingOff,
  IconRulerMeasure,
  IconToolsKitchen2,
  IconToolsKitchen2Off,
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
        <BooleanFeatureItem
          value={features.hasBus}
          icon={IconBus}
          iconOff={IconBusOff}
          text={t('bus-service')}
          textOff={t('no-bus-service')}
        />

        <BooleanFeatureItem
          value={features.hasParking}
          icon={IconParking}
          iconOff={IconParkingOff}
          text={t('parking')}
          textOff={t('no-parking')}
        />

        <BooleanFeatureItem
          value={features.hasLifeguard}
          icon={IconLifebuoy}
          iconOff={IconLifebuoyOff}
          text={t('lifeguard')}
          textOff={t('no-lifeguard')}
        />

        <BooleanFeatureItem
          value={features.hasToilet}
          icon={IconBadgeWc}
          iconOff={IconAccessibleOff}
          text={t('toilet')}
          textOff={t('no-toilet')}
        />

        <BooleanFeatureItem
          value={features.hasShower}
          icon={IconDroplets}
          iconOff={IconDropletOff}
          text={t('showers')}
          textOff={t('no-showers')}
        />

        <BooleanFeatureItem
          value={features.hasRestaurant}
          icon={IconToolsKitchen2}
          iconOff={IconToolsKitchen2Off}
          text={t('restaurants')}
          textOff={t('no-restaurants')}
        />

        <BooleanFeatureItem
          value={features.hasLeisure}
          icon={IconMoodSmile}
          iconOff={IconMoodOff}
          text={t('leisure-services')}
          textOff={t('no-leisure-services')}
        />

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

const BooleanFeatureItem: FC<{
  icon: Icon
  iconOff?: Icon
  text: string
  textOff?: string
  value: boolean | null
}> = ({ icon, iconOff, text, textOff, value }) => {
  if (value === null) return null

  return (
    <>
      {value ? (
        <FeatureItem icon={icon} text={text} />
      ) : (
        (textOff || iconOff) && (
          <FeatureItem icon={iconOff ?? icon} text={textOff ?? text} />
        )
      )}
    </>
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
