import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/navbar'
import { useTranslations } from 'next-intl'
import type { FC, PropsWithChildren } from 'react'
import { MoreOptions } from './_components/more-options'
import type { LocaleRouteParams } from '~/i18n'

type ProfileLayoutProps = PropsWithChildren<LocaleRouteParams>

const ProfileLayout: FC<ProfileLayoutProps> = ({ children }) => {
  const t = useTranslations('profile')

  return (
    <>
      <Navbar
        shouldHideOnScroll
        isBlurred={false}
        isBordered
        classNames={{ wrapper: 'max-w-2xl' }}
      >
        <NavbarContent justify="start">
          <NavbarItem>
            <h1 className="font-title">{t('heading')}</h1>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <MoreOptions />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {children}
    </>
  )
}

export default ProfileLayout
