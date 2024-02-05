'use client'

import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/navbar'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

export const ExploreTopbar: FC = () => {
  const t = useTranslations('explore')

  return (
    <Navbar isBlurred={false} isBordered classNames={{ wrapper: 'max-w-2xl' }}>
      <NavbarContent justify="start">
        <NavbarItem>
          <h1 className="font-title">{t('heading')}</h1>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
