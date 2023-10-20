import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/navbar'
import { useTranslations } from 'next-intl'
import type { FC, PropsWithChildren } from 'react'
import { LinkButton } from '~/components/link-button'
import type { LocaleRouteParams } from '~/i18n'

type SupportLayoutProps = PropsWithChildren<LocaleRouteParams>

const SupportLayout: FC<SupportLayoutProps> = ({ children }) => {
  const t = useTranslations('support')

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
            <LinkButton href="/explore" variant="solid" color="primary">
              {t('go-to-app')}
            </LinkButton>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="mx-auto max-w-2xl px-6 pb-32 pt-8">{children}</main>
    </>
  )
}

export default SupportLayout
