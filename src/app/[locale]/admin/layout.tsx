import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/navbar'
import { useTranslations } from 'next-intl'
import type { FC, PropsWithChildren } from 'react'
import type { LocaleRouteParams } from '~/i18n'
import { MoreOptions } from './_components/more-options'

type AdminLayoutProps = PropsWithChildren<LocaleRouteParams>

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const t = useTranslations('admin')

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

export default AdminLayout
