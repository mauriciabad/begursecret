'use client'

import Link from 'next-intl/link'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '~/helpers/cn'

export const TextLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof Link>
>(function TextLink({ className, children, ...props }, ref) {
  return (
    <Link
      ref={ref}
      className={cn('text-blue-600 hover:underline', className)}
      {...props}
    >
      {children}
    </Link>
  )
})
