import clsx from 'clsx'
import type { FC, HTMLAttributes } from 'react'

import { LanguageSwitcher } from './language-switcher'
import { DbEnvironmentTag } from './db-environment-tag'

export const Header: FC<Omit<HTMLAttributes<HTMLElement>, 'children'>> = ({
  className,
  ...props
}) => {
  return (
    <header
      className={clsx(
        'container mx-auto flex items-center justify-between p-4',
        className
      )}
      {...props}
    >
      <LanguageSwitcher />
      <div className="inline-flex items-center gap-4">
        <DbEnvironmentTag />
      </div>
    </header>
  )
}
