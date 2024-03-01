import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/navbar'
import { useTranslations } from 'next-intl'
import { unstable_setRequestLocale } from 'next-intl/server'
import type { FC, PropsWithChildren } from 'react'
import { parseLocale, type LocaleRouteParams } from '~/i18n'

type MissionsLayoutProps = PropsWithChildren<LocaleRouteParams>

const MissionsLayout: FC<MissionsLayoutProps> = ({ params, children }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const t = useTranslations('missions')

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
      </Navbar>

      <main className="mx-auto w-full max-w-2xl p-3">{children}</main>
    </>
  )
}

export default MissionsLayout
