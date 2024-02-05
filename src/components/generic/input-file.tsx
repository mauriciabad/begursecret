'use client'

import { FC, useId } from 'react'
import { cn } from '~/helpers/cn'

export const InputFile: FC<{
  className?: string
  multiple?: boolean
  type?: 'images'
  isDisabled?: boolean
  isInvalid?: boolean
  errorMessage?: string
  name?: string
  onValueChange?: (value: File[]) => void
  label: string
}> = ({
  className,
  multiple,
  type,
  isDisabled,
  isInvalid,
  errorMessage,
  name,
  onValueChange,
  label,
}) => {
  const id = useId()
  return (
    <div className={cn(className)}>
      <label htmlFor={id} className="mb-2 ml-0.5 block text-sm">
        {label}
      </label>
      <input
        className={cn(
          'block w-full min-w-0 cursor-pointer rounded-xl border-2 border-gray-200 text-sm shadow-sm',
          'file:me-4 file:cursor-pointer file:border-0 file:bg-primary-400 file:px-4 file:py-2 file:text-white',
          'focus:z-10 focus:border-primary-500 focus:ring-primary-500',
          'disabled:pointer-events-none disabled:opacity-50',
          isInvalid && 'border-red-500'
        )}
        type="file"
        name={name}
        id={id}
        multiple={multiple}
        accept={type === 'images' ? 'image/*' : undefined}
        disabled={isDisabled}
        onChange={(e) => {
          onValueChange?.(Array.from(e.target.files ?? []))
        }}
      />
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}
