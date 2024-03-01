import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/navbar'
import { IconBolt } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { unstable_setRequestLocale } from 'next-intl/server'
import type { FC, PropsWithChildren } from 'react'
import { parseLocale, type LocaleRouteParams } from '~/i18n'
import { Link } from '~/navigation'
import { MoreOptions } from './_components/more-options'

type AdminLayoutProps = PropsWithChildren<LocaleRouteParams>

const AdminLayout: FC<AdminLayoutProps> = ({ params, children }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const t = useTranslations('admin')

  return (
    <>
      <Navbar
        shouldHideOnScroll
        isBlurred={false}
        isBordered
        classNames={{ wrapper: 'max-w-7xl' }}
      >
        <NavbarContent justify="start">
          <NavbarItem>
            <h1 className="font-title">
              <IconBolt className="mr-1 inline-block text-yellow-600" />
              <Link href="/admin" className="hover:underline">
                {t('heading')}
              </Link>
            </h1>
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
