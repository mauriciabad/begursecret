import { Card } from '@nextui-org/card'
import { Icon } from '@tabler/icons-react'
import MDEditor from '@uiw/react-md-editor'
import { FC } from 'react'
import { cn } from '~/helpers/cn'
import { MarkdownContent } from './markdown-content'

export const MarkdownEditor: FC<{
  isInvalid?: boolean
  errorMessage?: string
  value?: string | null | undefined
  onChange?: (e: { target: { value: string | null } }) => void
  onBlur?: () => void
  label?: string
  className?: string
  icon?: Icon
}> = ({
  isInvalid,
  errorMessage,
  label,
  value,
  onChange,
  onBlur,
  className,
  icon,
}) => {
  const Icon = icon
  return (
    <div className={cn('flex flex-col', className)}>
      <p className="mb-1">
        {Icon && <Icon size={18} className="me-1 inline-block" />}
        {label}
      </p>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <Card
        radius="sm"
        className={cn(
          {
            'border-2 border-red-500': isInvalid,
          },
          'grow'
        )}
      >
        <MDEditor
          data-color-mode="light"
          aria-label={label}
          value={value ?? ''}
          onChange={(value) => {
            onChange?.({
              target: {
                value: value || null,
              },
            })
          }}
          onBlur={onBlur}
          components={{
            preview: (source) => (
              <MarkdownContent content={source} className="mt-4" />
            ),
          }}
          preview="edit"
          height="100%"
        />
      </Card>
    </div>
  )
}
