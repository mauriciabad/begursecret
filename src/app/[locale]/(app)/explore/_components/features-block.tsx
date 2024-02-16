import { Card, CardBody } from '@nextui-org/card'
import { Tooltip } from '@nextui-org/tooltip'
import { Icon, IconInfoCircle } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC, PropsWithChildren } from 'react'
import { MarkdownContent } from '~/components/generic/markdown-content'
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
    <Card className={className} radius="lg" shadow="sm">
      <CardBody className="gap-2">
        {featureDisplayGroups.map(
          (group) =>
            !allValuesNullInGroup[group.key] && (
              <FeatureList key={group.key} title={t(`titles.${group.key}`)}>
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
                            key={featureDisplay.key}
                            icon={featureDisplay.icon}
                            text={String(value)}
                            moreInfo={getMoreInfoContent(featureDisplay)}
                          />
                        )
                      } else {
                        return (
                          <FeatureItem
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
        <FeatureItem icon={icon} text={text} moreInfo={moreInfo} />
      ) : (
        (textOff || iconOff) && (
          <FeatureItem
            icon={iconOff ?? icon}
            text={textOff ?? text}
            moreInfo={moreInfo}
          />
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
