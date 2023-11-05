import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/navbar'
import { IconHelpCircle } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import type { FC, PropsWithChildren } from 'react'
import { LinkIconButton } from '~/components/links/link-icon-button'
import type { LocaleRouteParams } from '~/i18n'

type HubLayoutProps = PropsWithChildren<LocaleRouteParams>

const HubLayout: FC<HubLayoutProps> = ({ children }) => {
  const t = useTranslations('hub')

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
            <LinkIconButton label={t('support')} href="/support">
              <IconHelpCircle />
            </LinkIconButton>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="mx-auto max-w-2xl px-6 py-3">{children}</main>
    </>
  )
}

export default HubLayout
