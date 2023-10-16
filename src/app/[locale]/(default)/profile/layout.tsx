import '~/globals.css'

import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/navbar'
import { IconBell } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import type { FC, PropsWithChildren } from 'react'
import { PageLayout } from '~/components/layouts/page-layout'
import { BottomNavbar } from '~/components/navbar/bottom-navbar'
import type { LocaleRouteParams } from '~/i18n'
import Link from 'next-intl/link'
import { MoreOptionsModal } from './_components/more-options-modal'

type ProfileLayoutProps = PropsWithChildren<LocaleRouteParams>

const ProfileLayout: FC<ProfileLayoutProps> = ({ children }) => {
  const t = useTranslations('profile')

  return (
    <PageLayout>
      <Navbar
        shouldHideOnScroll
        isBlurred={false}
        isBordered
        classNames={{ wrapper: 'max-w-2xl' }}
      >
        <NavbarContent justify="start">
          <NavbarItem>
            <h1>{t('heading')}</h1>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Link color="foreground" href="/profile/notifications">
              <IconBell />
            </Link>
          </NavbarItem>
          <NavbarItem>
            <MoreOptionsModal />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="mx-auto max-w-2xl px-6 py-3">{children}</main>

      <BottomNavbar />
    </PageLayout>
  )
}

export default ProfileLayout
