import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/navbar'
import { useTranslations } from 'next-intl'
import type { FC, PropsWithChildren } from 'react'
import type { LocaleRouteParams } from '~/i18n'
import { MoreOptionsModal } from './_components/more-options-modal'

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
            <MoreOptionsModal />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="mx-auto max-w-2xl px-6 py-3">{children}</main>
    </>
  )
}

export default ProfileLayout
