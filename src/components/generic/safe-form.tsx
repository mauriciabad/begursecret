'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ButtonProps } from '@nextui-org/button'
import { Button } from '@nextui-org/button'
import { useTranslations } from 'next-intl'
import { useId } from 'react'
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
  useForm,
  useFormContext,
} from 'react-hook-form'
import { z } from 'zod'

// ******************************************************************* //
// * Original code from https://kitchen-sink.trpc.io/react-hook-form * //
// ******************************************************************* //

type UseZodForm<TInput extends FieldValues> = UseFormReturn<TInput> & {
  /**
   * A unique ID for this form.
   */
  id: string
}
export function useSafeForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema
  }
) {
  type FormType = UseZodForm<TSchema['_input']>
  const form = useForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, undefined, {
      // This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server
      raw: true,
    }),
  }) as FormType

  form.id = useId()

  const nextuiRegister = (...args: Parameters<FormType['register']>) => {
    const [key, options] = args
    return {
      ...form.register(key, options),
      isInvalid: !!form.formState.errors[key],
      errorMessage: form.formState.errors[key]?.message,
    }
  }

  const noRefRegister = (...args: Parameters<typeof nextuiRegister>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ref, ...rest } = nextuiRegister(...args)
    return rest
  }

  return { form, nextuiRegister, noRefRegister }
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type AnyZodForm = UseZodForm<any>

export function SafeForm<TInput extends FieldValues>(
  props: Omit<React.ComponentProps<'form'>, 'onSubmit' | 'id'> & {
    handleSubmit: SubmitHandler<TInput>
    form: UseZodForm<TInput>
  }
) {
  const { handleSubmit, form, ...passThrough }: typeof props = props
  return (
    <FormProvider {...form}>
      <form
        {...passThrough}
        id={form.id}
        onSubmit={(event) => {
          form.handleSubmit(async (values) => {
            try {
              await handleSubmit(values)
            } catch (cause) {
              form.setError('root.server', {
                message: (cause as Error)?.message ?? 'Unknown error',
                type: 'server',
              })
            }
          })(event)
        }}
      />
    </FormProvider>
  )
}

export function SafeSubmitButton({
  text,
  loadingText,
  form: propsForm,
  ...buttonProps
}: Omit<ButtonProps, 'type' | 'form' | 'disabled'> & {
  form?: AnyZodForm
  text?: string
  loadingText?: string
}) {
  const context = useFormContext()
  const t = useTranslations('common')

  const form = propsForm ?? context
  if (!form) {
    throw new Error(
      'SubmitButton must be used within a Form or have a form prop'
    )
  }
  const { formState } = form

  return (
    <Button
      {...buttonProps}
      form={propsForm?.id}
      type="submit"
      disabled={formState.isSubmitting}
    >
      {formState.isSubmitting ? loadingText ?? t('loading') : text ?? t('save')}
    </Button>
  )
}
