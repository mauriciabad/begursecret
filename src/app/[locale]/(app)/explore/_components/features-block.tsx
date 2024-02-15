import { Card, CardBody } from '@nextui-org/card'
import { Tooltip } from '@nextui-org/tooltip'
import { Icon, IconInfoCircle } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC, PropsWithChildren } from 'react'
import { MarkdownContent } from '~/components/generic/markdown-content'
import { IntlMessageKeys } from '~/helpers/types'
import { pick } from '~/helpers/utilities'
import { Features } from '~/server/db/constants/features'
import {
  featureDisplayGroups,
  getCompositeFeatureKey,
  getIconForFeature,
  getMoreInfoContent,
} from '~/server/db/constants/features-display-data'

export const FeaturesBlock: FC<{ features: Features; className?: string }> = ({
  features,
  className,
}) => {
  const t = useTranslations('data.features')

  return (
    <Card className={className} radius="lg" shadow="sm">
      <CardBody className="gap-2">
        {featureDisplayGroups.map((group) => (
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

                  if ('showRaw' in featureDisplay && featureDisplay.showRaw) {
                    return (
                      <FeatureItem
                        key={featureDisplay.key}
                        icon={featureDisplay.icon}
                        text={String(value)}
                        moreInfo={getMoreInfoContent(featureDisplay, features)}
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
                        moreInfo={getMoreInfoContent(featureDisplay, features)}
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
                      moreInfo={getMoreInfoContent(featureDisplay, features)}
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
                      text={t(`values.boolean.${featureDisplay.key}.${value}`)}
                      value={value}
                      moreInfo={getMoreInfoContent(featureDisplay, features)}
                    />
                  )
                }
                case 'composite': {
                  const rawValues = pick(
                    features,
                    featureDisplay.keys
                  ) as Parameters<(typeof featureDisplay)['transformValues']>[0]

                  if (
                    featureDisplay.showIf &&
                    !featureDisplay.showIf(rawValues)
                  ) {
                    return null
                  }

                  const values = featureDisplay?.transformValues(rawValues)

                  const key = getCompositeFeatureKey(featureDisplay.keys)
                  return (
                    <FeatureItem
                      key={key}
                      icon={featureDisplay.icon}
                      text={t(`values.composite.${key}`, values)}
                      moreInfo={getMoreInfoContent(featureDisplay, features)}
                    />
                  )
                }
              }
            })}
          </FeatureList>
        ))}
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
