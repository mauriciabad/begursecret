'use client'

import {
  IconAdjustmentsHorizontal,
  IconBolt,
  IconEdit,
  IconHelpCircle,
  IconLogout,
  IconMessage,
  IconSettings,
} from '@tabler/icons-react'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import {
  MoreOptionsModal,
  MoreOptionsModalButton,
  MoreOptionsModalDivider,
  MoreOptionsModalLanguageSwitcher,
} from '~/components/generic/more-options-modal/more-options-modal'

export const MoreOptions: FC = () => {
  const t = useTranslations('profile.more-options')
  const { data: session } = useSession()

  return (
    <MoreOptionsModal title={t('title')}>
      {session && (
        <>
          <MoreOptionsModalButton
            url="/complete-profile"
            text={t('edit')}
            icon={<IconEdit />}
          />
          <MoreOptionsModalButton
            url="/profile/preferences"
            text={t('preferences')}
            icon={<IconAdjustmentsHorizontal />}
          />

          <MoreOptionsModalDivider />
        </>
      )}
      <MoreOptionsModalButton
        url="/profile/app-settings"
        text={t('app-settings')}
        icon={<IconSettings />}
      />
      {session?.user.role === 'admin' && (
        <MoreOptionsModalButton
          url="/admin"
          text={t('go-to-admin')}
          icon={<IconBolt />}
          secondaryIcon="lock"
        />
      )}
      {session && (
        <MoreOptionsModalButton
          onClick={() => signOut({ callbackUrl: '/' })}
          text={t('logout')}
          icon={<IconLogout />}
        />
      )}

      <MoreOptionsModalDivider />

      <MoreOptionsModalLanguageSwitcher />

      <MoreOptionsModalButton
        url="/support"
        text={t('support')}
        icon={<IconHelpCircle />}
        secondaryIcon="external-link"
      />
      <MoreOptionsModalButton
        url="mailto:hola@begursecret.com?subject=Feedback"
        text={t('feedback')}
        icon={<IconMessage />}
        secondaryIcon="mail-forward"
      />
    </MoreOptionsModal>
  )
}
