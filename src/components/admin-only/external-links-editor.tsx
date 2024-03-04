import { Button, Checkbox, Divider, Input } from '@nextui-org/react'
import { IconExternalLink, IconPlus, IconTrash } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import {
  Control,
  Controller,
  FieldValues,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { cn } from '~/helpers/cn'
import { Link } from '~/navigation'
import { CardInputContainer } from '../generic/card-input-container'

export const ExternalLinksEditor: FC<{
  className?: string
  label?: string
}> = ({ className, label }) => {
  const t = useTranslations('admin-places-and-routes')

  const form = useFormContext()
  const error = form.getFieldState('externalLinks').error

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'externalLinks',
  })

  return (
    <CardInputContainer
      className={cn('mx-auto max-w-lg', className)}
      errorMessage={error?.message}
      isInvalid={!!error}
      label={label}
    >
      {fields.map((field, index) => (
        <ExternalLinkItem
          key={field.id}
          control={form.control}
          index={index}
          field={field}
          onRemove={() => remove(index)}
        />
      ))}
      <Button
        onPress={() => append({ url: '', title: '', isOfficialWebsite: false })}
        startContent={<IconPlus />}
        color="primary"
      >
        {t('externalLinks.addLink')}
      </Button>
    </CardInputContainer>
  )
}

const ExternalLinkItem: FC<{
  control: Control
  index: number
  field: FieldValues
  onRemove: () => void
}> = ({ control, index, field, onRemove }) => {
  const t = useTranslations('admin-places-and-routes')

  const value = useWatch({
    name: 'externalLinks',
    control,
  })

  return (
    <div key={field.id} className="space-y-4">
      {index !== 0 && <Divider />}

      <div className="flex gap-4">
        <Controller
          name={`externalLinks.${index}.title`}
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <Input
              isInvalid={!!error}
              errorMessage={error?.message}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              label={t('externalLinks.title')}
            />
          )}
        />
        <Controller
          name={`externalLinks.${index}.isOfficialWebsite`}
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <Checkbox
              isInvalid={!!error}
              onBlur={onBlur}
              onChange={onChange}
              isSelected={value}
              className="shrink-0"
            >
              {t('externalLinks.isOfficialWebsite')}
            </Checkbox>
          )}
        />
      </div>

      <div className="flex items-center gap-4">
        <Controller
          name={`externalLinks.${index}.url`}
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <Input
              isInvalid={!!error}
              errorMessage={error?.message}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              label={t('externalLinks.url')}
              type="url"
            />
          )}
        />

        <Button
          as={Link}
          href={value[index].url}
          target="_blank"
          isIconOnly
          size="lg"
          isDisabled={!value[index].url}
        >
          <IconExternalLink />
        </Button>

        <Button onPress={() => onRemove()} isIconOnly size="lg">
          <IconTrash />
        </Button>
      </div>
    </div>
  )
}
