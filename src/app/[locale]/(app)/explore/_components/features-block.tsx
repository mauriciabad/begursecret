import { Card, CardBody } from '@nextui-org/card'
import { Tooltip } from '@nextui-org/tooltip'
import { Icon, IconInfoCircle } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC, PropsWithChildren } from 'react'
import { MarkdownContent } from '~/components/generic/markdown-content'
import { cn } from '~/helpers/cn'
import { IntlMessageKeys } from '~/helpers/types'
import { Features } from '~/server/db/constants/features'
import {
  featureDisplayGroups,
  getCompositeFeatureKey,
  getCompositeFeatureValues,
  getIconForFeature,
  useFeatureDisplay,
} from '~/server/db/constants/features-display-data'

export const FeaturesBlock: FC<{ features: Features; className?: string }> = ({
  features,
  className,
}) => {
  const t = useTranslations('data.features')

  const { allValuesNull, allValuesNullInGroup, getMoreInfoContent } =
    useFeatureDisplay(features)

  if (allValuesNull) return null

  return (
    <Card className={cn('bg-cream', className)} radius="lg" shadow="none">
      <CardBody className="gap-2">
        {featureDisplayGroups.map(
          (group) =>
            !allValuesNullInGroup[group.key] && (
              <FeatureList
                key={group.key}
                title={t(`titles.${group.key}`)}
                variant={group.key === 'notes' ? 'blocks' : 'items'}
              >
                {group.featureDisplays.map((featureDisplay) => {
                  if ('hidden' in featureDisplay && featureDisplay.hidden) {
                    return null
                  }

                  switch (featureDisplay.type) {
                    case 'number':
                    case 'text': {
                      const value = features[featureDisplay.key]
                      if (value === null || value === undefined) return null

                      if (
                        'showRaw' in featureDisplay &&
                        featureDisplay.showRaw
                      ) {
                        return (
                          <FeatureItem
                            as="li"
                            key={featureDisplay.key}
                            icon={featureDisplay.icon}
                            text={String(value)}
                            moreInfo={getMoreInfoContent(featureDisplay)}
                          />
                        )
                      } else {
                        return (
                          <FeatureItem
                            as="li"
                            key={featureDisplay.key}
                            icon={featureDisplay.icon}
                            text={t(
                              `values.${`${featureDisplay.type}.${featureDisplay.key}` as IntlMessageKeys<'data.features.values'>}`,
                              {
                                value,
                              }
                            )}
                            moreInfo={getMoreInfoContent(featureDisplay)}
                          />
                        )
                      }
                    }
                    case 'markdown': {
                      const value = features[featureDisplay.key]
                      if (value === null || value === undefined) return null
                      return (
                        <MarkdownFeatureItem
                          key={featureDisplay.key}
                          icon={featureDisplay.icon}
                          label={t(`labels.${featureDisplay.key}`)}
                          content={value}
                        />
                      )
                    }
                    case 'enum': {
                      const value = features[featureDisplay.key]
                      if (value === null || value === undefined) return null

                      return (
                        <FeatureItem
                          as="li"
                          key={featureDisplay.key}
                          icon={getIconForFeature(featureDisplay, value)}
                          text={t(
                            `values.enum.${`${featureDisplay.key}.${value}` as IntlMessageKeys<'data.features.values.enum'>}`
                          )}
                          moreInfo={getMoreInfoContent(featureDisplay)}
                        />
                      )
                    }
                    case 'boolean': {
                      const value = features[featureDisplay.key]
                      if (value === null || value === undefined) return null

                      return (
                        <BooleanFeatureItem
                          key={featureDisplay.key}
                          icon={getIconForFeature(featureDisplay, true)}
                          iconOff={getIconForFeature(featureDisplay, false)}
                          text={t(
                            `values.boolean.${featureDisplay.key}.${value}`
                          )}
                          value={value}
                          moreInfo={getMoreInfoContent(featureDisplay)}
                        />
                      )
                    }
                    case 'composite': {
                      const values = getCompositeFeatureValues(
                        featureDisplay,
                        features
                      )

                      if (!values) return null

                      const key = getCompositeFeatureKey(featureDisplay.keys)
                      return (
                        <FeatureItem
                          as="li"
                          key={key}
                          icon={featureDisplay.icon}
                          text={t(`values.composite.${key}`, values)}
                          moreInfo={getMoreInfoContent(featureDisplay)}
                        />
                      )
                    }
                  }
                })}
              </FeatureList>
            )
        )}
      </CardBody>
    </Card>
  )
}

const FeatureItem: FC<{
  icon: Icon
  text: string
  moreInfo?: string | null
  as?: 'li' | 'div'
}> = ({ icon, text, moreInfo, as: htmlAs = 'div' }) => {
  const Icon = icon
  const Component = htmlAs

  return (
    <>
      {moreInfo ? (
        <Tooltip
          content={
            <MarkdownContent className="text-stone-800" content={moreInfo} />
          }
        >
          <Component className="flex items-start gap-2">
            <Icon size={18} className="shrink-0 text-stone-800" />
            <span className="text-sm font-medium text-stone-800">
              {text}
              <IconInfoCircle
                size={16}
                className="ml-1 box-content inline-block shrink-0 text-stone-400"
              />
            </span>
          </Component>
        </Tooltip>
      ) : (
        <Component className="flex items-start gap-2">
          <Icon size={18} className="shrink-0 text-stone-800" />
          <span className="text-sm font-medium text-stone-800">{text}</span>
        </Component>
      )}
    </>
  )
}

const MarkdownFeatureItem: FC<{
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
  moreInfo?: string | null
}> = ({ icon, iconOff, text, textOff, value, moreInfo }) => {
  if (value === null || value === undefined) return null

  return (
    <>
      {value ? (
        <FeatureItem as="li" icon={icon} text={text} moreInfo={moreInfo} />
      ) : (
        (textOff || iconOff) && (
          <FeatureItem
            as="li"
            icon={iconOff ?? icon}
            text={textOff ?? text}
            moreInfo={moreInfo}
          />
        )
      )}
    </>
  )
}

const FeatureList: FC<
  PropsWithChildren<{
    title: string
    variant?: 'items' | 'blocks'
  }>
> = ({ title, children, variant }) => {
  return (
    <div>
      <h4 className="mb-2 mt-2 text-sm font-semibold leading-none text-foreground-700">
        {title}
      </h4>
      <ul
        className={cn('grid gap-2 pl-1', {
          'xs2:grid-cols-2': variant === 'items',
          'sm:grid-cols-2': variant === 'blocks',
        })}
      >
        {children}
      </ul>
    </div>
  )
}
