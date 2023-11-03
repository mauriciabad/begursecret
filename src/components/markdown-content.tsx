import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { cn } from '~/helpers/cn'

export const MarkdownContent: FC<{ content: string; className?: string }> = ({
  content,
  className,
}) => {
  return (
    <div
      className={cn(
        'prose prose-headings:font-title prose-headings:text-stone-800 prose-h2:mb-2 prose-h2:mt-4',
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
