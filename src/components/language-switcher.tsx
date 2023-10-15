'use client'

import { cn } from '~/helpers/cn'
import { useLocale } from 'next-intl'
import { usePathname } from 'next-intl/client'
import Link from 'next-intl/link'
import type { FC, HTMLAttributes } from 'react'

import { locales } from '~/i18n'

export const LanguageSwitcher: FC<
  Omit<HTMLAttributes<HTMLElement>, 'children'>
> = (props) => {
  const pathname = usePathname()
  const currentLocale = useLocale()

  return (
    <nav {...props}>
      <ul className="flex gap-4">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              href={pathname}
              locale={locale}
              prefetch={false}
              className={cn('hover:underline', {
                'font-bold': currentLocale === locale,
              })}
            >
              {locale.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
