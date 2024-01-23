'use client'

import { IconDeviceMobile, IconLogout } from '@tabler/icons-react'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import {
  MoreOptionsModal,
  MoreOptionsModalButton,
  MoreOptionsModalDivider,
  MoreOptionsModalLanguageSwitcher,
} from '~/components/generic/more-options-modal/more-options-modal'

export const MoreOptions: FC = () => {
  const t = useTranslations('admin.more-options')

  return (
    <MoreOptionsModal title={t('title')}>
      <MoreOptionsModalButton
        onClick={() => signOut({ callbackUrl: '/admin-login' })}
        text={t('logout')}
        icon={<IconLogout />}
      />

      <MoreOptionsModalDivider />

      <MoreOptionsModalLanguageSwitcher />

      <MoreOptionsModalButton
        url="/"
        text={t('go-to-app')}
        icon={<IconDeviceMobile />}
        isExternal
      />
    </MoreOptionsModal>
  )
}
