import { Card, CardBody } from '@nextui-org/card'
import { Input, Select, SelectItem } from '@nextui-org/react'
import { Icon } from '@tabler/icons-react'
import { InferInsertModel } from 'drizzle-orm'
import { useTranslations } from 'next-intl'
import { FC, PropsWithChildren } from 'react'
import { cn } from '~/helpers/cn'
import { IntlMessageKeys } from '~/helpers/types'
import {
  featureDisplayGroups,
  getIconForFeature,
} from '~/server/db/constants/features-display-data'
import { features } from '~/server/db/schema'
import { MarkdownEditor } from '../generic/markdown-editor'
import { ThreeStateCheckbox } from '../generic/three-state-checkbox'

type FeaturesInsert = InferInsertModel<typeof features>

export const FeaturesEditor: FC<{
  isInvalid?: boolean
  errorMessage?: string
  label?: string
  value?: FeaturesInsert | undefined | null
  onChange: (e: { target: { value: FeaturesInsert | undefined } }) => void
  onBlur: () => void
  className?: string
}> = ({
  isInvalid,
  errorMessage,
  label,
  value,
  onChange,
  onBlur,
  className,
}) => {
  const tFeat = useTranslations('data.features')
  const tAdmin = useTranslations('admin-places')

  return (
    <div className={cn(className)}>
      <p className="mb-1">{label}</p>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <Card radius="sm" className={cn(isInvalid && 'border-2 border-red-500')}>
        <CardBody className="gap-4 p-5">
          {value ? (
            featureDisplayGroups.map((group) => (
              <FeatureList key={group.key} title={tFeat(`titles.${group.key}`)}>
                {group.featureDisplays.map((featureDisplay) => {
                  switch (featureDisplay.type) {
                    case 'number':
                    case 'text': {
                      const featureValue = value[featureDisplay.key]

                      return (
                        <TextFeatureInput
                          type={featureDisplay.type}
                          key={featureDisplay.key}
                          icon={featureDisplay.icon}
                          value={String(featureValue)}
                          label={tFeat(`labels.${featureDisplay.key}`)}
                        />
                      )
                    }
                    case 'markdown': {
                      const featureValue = value[featureDisplay.key]

                      return (
                        <MarkdownFeatureInput
                          key={featureDisplay.key}
                          icon={featureDisplay.icon}
                          label={tFeat(`labels.${featureDisplay.key}`)}
                          content={featureValue}
                        />
                      )
                    }
                    case 'enum': {
                      const featureValue = value[featureDisplay.key]

                      return (
                        <SelectFeatureInput
                          key={featureDisplay.key}
                          icon={getIconForFeature(featureDisplay, featureValue)}
                          label={tFeat(`labels.${featureDisplay.key}`)}
                          value={featureValue}
                          options={featureDisplay.options.map((option) => ({
                            key: option,
                            value: tFeat(
                              `values.enum.${`${featureDisplay.key}.${option}` as IntlMessageKeys<'data.features.values.enum'>}`
                            ),
                            icon: getIconForFeature(featureDisplay, option),
                          }))}
                        />
                      )
                    }
                    case 'boolean': {
                      const featureValue = value[featureDisplay.key]

                      return (
                        <BooleanFeatureInput
                          key={featureDisplay.key}
                          icon={getIconForFeature(featureDisplay, true)}
                          label={tFeat(`labels.${featureDisplay.key}`)}
                          value={featureValue}
                        />
                      )
                    }
                  }
                })}
              </FeatureList>
            ))
          ) : (
            <p className="text-stone-500">{tAdmin('no-features')}</p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

const TextFeatureInput: FC<{
  icon: Icon
  label: string
  value: string | null | undefined
  type: 'number' | 'text'
}> = ({ icon, label, value, type }) => {
  const Icon = icon

  return (
    <Input
      type={type}
      label={label}
      startContent={Icon && <Icon size={20} />}
      value={value ?? undefined}
      placeholder=" "
      variant="bordered"
    />
  )
}

const SelectFeatureInput: FC<{
  icon: Icon
  label: string
  value: string | null | undefined
  options: {
    key: string
    value: string
    icon?: Icon
  }[]
}> = ({ icon, label, value, options }) => {
  const Icon = icon

  return (
    <Select
      label={label}
      startContent={Icon && <Icon size={20} />}
      selectedKeys={value ? [value] : []}
      placeholder=" "
      variant="bordered"
    >
      {options.map((option) => (
        <SelectItem
          key={option.key}
          value={option.key}
          startContent={option.icon && <option.icon size={20} />}
        >
          {option.value}
        </SelectItem>
      ))}
    </Select>
  )
}

const MarkdownFeatureInput: FC<{
  icon: Icon
  label: string
  content: string | null | undefined
}> = ({ icon, label, content }) => {
  return (
    <MarkdownEditor
      label={label}
      icon={icon}
      className="px-1 text-sm text-stone-800"
      value={content}
    />
  )
}

const BooleanFeatureInput: FC<{
  icon: Icon
  label: string
  value: boolean | null | undefined
}> = ({ icon, label, value }) => {
  return (
    <ThreeStateCheckbox
      value={value}
      label={label}
      icon={icon}
      className="px-2 py-0.5"
    />
  )
}

const FeatureList: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  return (
    <div>
      <h4 className="mb-2 font-bold leading-none">{title}</h4>
      <ul className="grid gap-2 xs2:grid-cols-2">{children}</ul>
    </div>
  )
}
