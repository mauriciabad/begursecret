import { Card, CardBody } from '@nextui-org/card'
import { Tooltip } from '@nextui-org/tooltip'
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
  IconInfoCircle,
  IconLifebuoy,
  IconLifebuoyOff,
  IconMoodOff,
  IconMoodSmile,
  IconParking,
  IconParkingOff,
  IconRulerMeasure,
  IconTicket,
  IconToolsKitchen2,
  IconToolsKitchen2Off,
  IconWalk,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC, PropsWithChildren } from 'react'
import { MarkdownContent } from '~/components/generic/markdown-content'
import { Difficulty, Features } from '~/server/db/constants/features'

const difficultyIcon = {
  accessible: IconAccessible,
  normal: IconAccessible,
  smallEffort: IconAccessibleOff,
  hard: IconAlertTriangle,
  dangerous: IconAlertTriangleFilled,
} as const satisfies Record<Difficulty, Icon>

export const FeaturesBlock: FC<{ features: Features; className?: string }> = ({
  features,
  className,
}) => {
  const t = useTranslations('explore.features')

  return (
    <Card className={className} radius="lg" shadow="sm">
      <CardBody className="gap-2">
        <FeatureList title={t('features')}>
          {features.price && (
            <FeatureItem
              icon={IconCurrencyEuro}
              text={t('price-value', {
                price: features.price,
                units: t(`price-unit.${features.priceUnit ?? 'eur'}`),
              })}
              moreInfo={features.priceNotes}
            />
          )}

          {features.difficulty && (
            <FeatureItem
              icon={difficultyIcon[features.difficulty]}
              text={t(`difficulty.${features.difficulty}`)}
              moreInfo={features.difficultyNotes}
            />
          )}

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

          {features.timeToArrive && (
            <FeatureItem
              icon={IconWalk}
              text={t('time-from-place', {
                time: t('time-duration', {
                  hours: Math.floor(features.timeToArrive / 60),
                  minutes: features.timeToArrive % 60,
                }),
                place: features.placeToArriveFrom,
              })}
            />
          )}

          {features.parkingSpaces && (
            <FeatureItem
              icon={IconCar}
              text={t('parking-spaces', { spaces: features.parkingSpaces })}
            />
          )}

          {features.isCovered && (
            <FeatureItem icon={IconCarGarage} text={t('covered')} />
          )}

          {features.isFreeWithLocalStamp && (
            <FeatureItem
              icon={IconTicket}
              text={t('free-with-local-stamp')}
              moreInfo="aa"
            />
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

        <FeatureList title={t('notes')}>
          {features.priceNotes && (
            <NotesFeatureItem
              icon={IconCurrencyEuro}
              label={t('price')}
              content={features.priceNotes}
            />
          )}
          {features.difficultyNotes && (
            <NotesFeatureItem
              icon={difficultyIcon[features.difficulty ?? 'accessible']}
              label={t('accessibility')}
              content={features.difficultyNotes}
            />
          )}
        </FeatureList>
      </CardBody>
    </Card>
  )
}

const FeatureItem: FC<{
  icon: Icon
  text: string
  moreInfo?: string | null
}> = ({ icon, text, moreInfo }) => {
  const Icon = icon

  return (
    <>
      {moreInfo ? (
        <Tooltip
          content={
            <MarkdownContent className="text-stone-800" content={moreInfo} />
          }
        >
          <li className="flex items-start gap-2">
            <Icon size={18} className="shrink-0 text-stone-800" />
            <span className="text-sm font-medium text-stone-800">
              {text}
              <IconInfoCircle
                size={16}
                className="ml-1 box-content inline-block shrink-0 text-stone-400"
              />
            </span>
          </li>
        </Tooltip>
      ) : (
        <li className="flex items-start gap-2">
          <Icon size={18} className="shrink-0 text-stone-800" />
          <span className="text-sm font-medium text-stone-800">{text}</span>
        </li>
      )}
    </>
  )
}

const NotesFeatureItem: FC<{
  icon: Icon
  label: string
  content: string
}> = ({ icon, label, content }) => {
  return (
    <li>
      <FeatureItem icon={icon} text={label} />
      <MarkdownContent
        className="px-1 text-sm text-stone-800"
        content={content}
      />
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
      <ul className="grid gap-2 xs2:grid-cols-2">{children}</ul>
    </div>
  )
}
