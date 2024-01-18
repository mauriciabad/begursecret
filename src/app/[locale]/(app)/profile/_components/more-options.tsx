'use client'

import {
  IconAdjustmentsHorizontal,
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
        isExternal
      />
      <MoreOptionsModalButton
        url="/support/feedback"
        text={t('feedback')}
        icon={<IconMessage />}
        isExternal
      />
    </MoreOptionsModal>
  )
}
