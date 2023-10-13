import clsx from 'clsx'
import type { FC, HTMLAttributes } from 'react'

import { LanguageSwitcher } from './language-switcher'
import { UserLogin } from './user-login'

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
      <UserLogin />
    </header>
  )
}
