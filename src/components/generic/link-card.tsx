'use client'

import { Card } from '@nextui-org/react'
import Link from 'next-intl/link'
import { FC, ReactNode } from 'react'
import { cn } from '~/helpers/cn'

export const LinkCard: FC<{
  icon: ReactNode
  title: string
  href: string
  className?: string
}> = ({ icon, title, href, className }) => {
  return (
    <Card
      as={Link}
      shadow="none"
      radius="sm"
      isPressable
      href={href}
      className={cn(
        'flex flex-col items-center justify-center gap-1 border border-stone-200 bg-white p-4',
        className
      )}
    >
      {icon}
      <span className="text-center font-medium leading-4 text-stone-900">
        {title}
      </span>
    </Card>
  )
}
