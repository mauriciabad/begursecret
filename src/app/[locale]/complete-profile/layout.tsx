import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/navbar'
import { useTranslations } from 'next-intl'
import type { FC, PropsWithChildren } from 'react'
import { LinkButton } from '~/components/links/link-button'
import type { LocaleRouteParams } from '~/i18n'

type EditLayoutProps = PropsWithChildren<LocaleRouteParams>

const EditLayout: FC<EditLayoutProps> = ({ children }) => {
  const t = useTranslations('profile.completeProfile')

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
            <LinkButton href="/profile" variant="solid" color="primary">
              {t('go-to-profile')}
            </LinkButton>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="mx-auto max-w-2xl px-6 py-3">{children}</main>
    </>
  )
}

export default EditLayout
