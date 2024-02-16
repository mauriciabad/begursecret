import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { cn } from '~/helpers/cn'

export const MarkdownContent: FC<{
  content: string
  className?: string
  size?: 'sm' | 'md'
}> = ({ content, className, size }) => {
  return (
    <div
      className={cn(
        'prose prose-headings:font-title prose-headings:text-stone-800 prose-h2:mb-2 prose-h2:mt-4',
        {
          'prose-p:text-sm prose-p:leading-6 xs:prose-p:text-base':
            size === 'sm',
          '': size === 'md',
        },
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
