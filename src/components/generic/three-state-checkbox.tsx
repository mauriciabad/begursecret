import { Icon, IconCheck, IconQuestionMark, IconX } from '@tabler/icons-react'
import { FC } from 'react'
import { cn } from '~/helpers/cn'

export const ThreeStateCheckbox: FC<{
  isInvalid?: boolean
  errorMessage?: string
  value?: boolean | null
  onChange?: (e: { target: { checked: boolean | null } }) => void
  onBlur?: () => void
  label: string
  icon?: Icon
  className?: string
}> = ({ value, icon, label, onChange, onBlur, className }) => {
  const Icon = icon

  const nextValue = () => {
    if (value === null) return true
    if (value === true) return false
    return null
  }

  return (
    <label
      onClick={() => {
        onChange?.({
          target: {
            checked: nextValue(),
          },
        })
        onBlur?.()
      }}
      className={cn(
        'flex cursor-pointer select-none items-center gap-2',
        className
      )}
    >
      {Icon && <Icon size={20} />}
      <div
        className={cn(
          {
            'border-blue-500 bg-blue-500 text-white': value === true,
            'border-red-500 bg-red-500 text-white': value === false,
            'border-stone-300 bg-stone-50 text-stone-900': value === null,
          },
          'flex h-5 w-5 flex-shrink-0 items-center justify-center',
          'rounded-md border-2'
        )}
      >
        {value === true && <IconCheck size={18} stroke={2.5} className="" />}
        {value === false && <IconX size={18} stroke={2.5} className="" />}
        {value === null && (
          <IconQuestionMark size={18} stroke={2.5} className="" />
        )}
      </div>
      <span className="">{label}</span>
    </label>
  )
}
