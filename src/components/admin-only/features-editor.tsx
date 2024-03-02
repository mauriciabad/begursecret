import { Input, Select, SelectItem } from '@nextui-org/react'
import { Icon } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC, PropsWithChildren } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '~/helpers/cn'
import { ControlledInputProps, IntlMessageKeys } from '~/helpers/types'
import {
  featureDisplayGroups,
  getIconForFeature,
} from '~/server/db/constants/features-display-data'
import { CardInputContainer } from '../generic/card-input-container'
import { MarkdownEditor } from '../generic/markdown-editor'
import { ThreeStateCheckbox } from '../generic/three-state-checkbox'

export const FeaturesEditor: FC<{
  className?: string
  label?: string
}> = ({ className, label }) => {
  const t = useTranslations('data.features')
  const form = useFormContext()
  const errorSection = form.getFieldState('features').error

  return (
    <div className={cn(className)}>
      {label && (
        <div className="my-4 mt-16 flex items-center gap-2">
          <div
            className={cn(
              'flex-1 border-t border-stone-300',
              errorSection && 'border-red-900'
            )}
            aria-hidden
          />
          <h3
            className={cn(
              'inline-block font-title text-sm font-medium uppercase text-stone-600',
              errorSection && 'text-red-500'
            )}
          >
            {label}
          </h3>
          <div
            className={cn(
              'flex-1 border-t border-stone-300',
              errorSection && 'border-red-900'
            )}
            aria-hidden
          />
        </div>
      )}
      {errorSection?.message && (
        <p className="text-center text-red-500">{errorSection.message}</p>
      )}

      <div className="space-y-4">
        {featureDisplayGroups.map((group) => (
          <FeatureList key={group.key} title={t(`titles.${group.key}`)}>
            {group.featureDisplays.map((featureDisplay) => {
              switch (featureDisplay.type) {
                case 'number':
                case 'text': {
                  return (
                    <Controller
                      key={featureDisplay.key}
                      name={`features.${featureDisplay.key}`}
                      control={form.control}
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <TextFeatureInput
                          type={featureDisplay.type}
                          icon={featureDisplay.icon}
                          label={t(`labels.${featureDisplay.key}`)}
                          value={value ?? ''}
                          onChange={onChange}
                          onBlur={onBlur}
                          isInvalid={!!error}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                  )
                }
                case 'markdown': {
                  return (
                    <Controller
                      key={featureDisplay.key}
                      name={`features.${featureDisplay.key}`}
                      control={form.control}
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <MarkdownFeatureInput
                          icon={featureDisplay.icon}
                          label={t(`labels.${featureDisplay.key}`)}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          isInvalid={!!error}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                  )
                }
                case 'enum': {
                  return (
                    <Controller
                      key={featureDisplay.key}
                      name={`features.${featureDisplay.key}`}
                      control={form.control}
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <SelectFeatureInput
                          icon={getIconForFeature(featureDisplay, value)}
                          label={t(`labels.${featureDisplay.key}`)}
                          options={featureDisplay.options.map((option) => ({
                            key: option,
                            value: t(
                              `values.enum.${`${featureDisplay.key}.${option}` as IntlMessageKeys<'data.features.values.enum'>}`
                            ),
                            icon: getIconForFeature(featureDisplay, option),
                          }))}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          isInvalid={!!error}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                  )
                }
                case 'boolean': {
                  return (
                    <Controller
                      key={featureDisplay.key}
                      name={`features.${featureDisplay.key}`}
                      control={form.control}
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <BooleanFeatureInput
                          icon={getIconForFeature(featureDisplay, true)}
                          label={t(`labels.${featureDisplay.key}`)}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          isInvalid={!!error}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                  )
                }
              }
            })}
          </FeatureList>
        ))}
      </div>
    </div>
  )
}

const TextFeatureInput: FC<
  ControlledInputProps<string | number | null> & {
    icon: Icon
    label: string
    type: 'number' | 'text'
  }
> = ({
  icon,
  label,
  value,
  type,
  onChange,
  onBlur,
  isInvalid,
  errorMessage,
}) => {
  const Icon = icon

  return (
    <Input
      type={type}
      label={label}
      startContent={Icon && <Icon size={20} />}
      value={value?.toString() ?? undefined}
      placeholder=" "
      variant="bordered"
      onChange={(e) => {
        const value = e.target.value
        onChange?.({
          target: {
            value:
              value === '' ? null : type === 'number' ? Number(value) : value,
          },
        })
      }}
      onBlur={onBlur}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
    />
  )
}

const SelectFeatureInput: FC<
  ControlledInputProps & {
    icon: Icon
    label: string
    options: {
      key: string
      value: string
      icon?: Icon
    }[]
  }
> = ({
  icon,
  label,
  value,
  options,
  onChange,
  onBlur,
  isInvalid,
  errorMessage,
}) => {
  const Icon = icon

  return (
    <Select
      label={label}
      startContent={Icon && <Icon size={20} />}
      selectedKeys={value ? [value] : []}
      placeholder=" "
      variant="bordered"
      onChange={(e) => {
        const value = e.target.value
        onChange?.({
          target: {
            value: value || null,
          },
        })
      }}
      onBlur={onBlur}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
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

const MarkdownFeatureInput: FC<
  ControlledInputProps & {
    icon: Icon
    label: string
  }
> = ({ icon, label, value, onChange, onBlur, isInvalid, errorMessage }) => {
  return (
    <MarkdownEditor
      label={label}
      icon={icon}
      className="px-1 text-sm text-stone-800"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
    />
  )
}

const BooleanFeatureInput: FC<
  ControlledInputProps<boolean | null> & {
    icon: Icon
    label: string
  }
> = ({ icon, label, value, onChange, onBlur, isInvalid, errorMessage }) => {
  return (
    <ThreeStateCheckbox
      value={value}
      label={label}
      icon={icon}
      className="px-2 py-0.5"
      onChange={onChange}
      onBlur={onBlur}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
    />
  )
}

const FeatureList: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  return (
    <CardInputContainer label={title}>
      <ul className="grid gap-2 xs2:grid-cols-2">{children}</ul>
    </CardInputContainer>
  )
}
