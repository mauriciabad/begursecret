import { Card } from '@nextui-org/card'
import MDEditor from '@uiw/react-md-editor'
import { FC } from 'react'
import { cn } from '~/helpers/cn'
import { MarkdownContent } from './markdown-content'

export const MarkdownEditor: FC<{
  isInvalid?: boolean
  errorMessage?: string
  label?: string
  value?: string
  onChange: (e: { target: { value: string } }) => void
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
  return (
    <div className={cn('flex flex-col', className)}>
      <p className="mb-1">{label}</p>

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
            onChange({
              target: {
                value: value ?? '',
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
