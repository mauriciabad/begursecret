'use client'

import { Button } from '@nextui-org/button'
import { Divider } from '@nextui-org/divider'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal'
import {
  IconAdjustmentsHorizontal,
  IconEdit,
  IconExternalLink,
  IconHelpCircle,
  IconLogin,
  IconLogout,
  IconMenu2,
  IconMessage,
  IconSettings,
} from '@tabler/icons-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { FC, ReactNode } from 'react'
import { LanguageSwitcher } from '~/components/language-switcher'

export const MoreOptionsModal: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const t = useTranslations('profile.more-options')
  const { data: session } = useSession()

  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        aria-label={t('title')}
        variant="light"
      >
        <IconMenu2 />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: 'gap-0 p-2',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2>{t('title')}</h2>
              </ModalHeader>

              <ModalBody>
                <MoreOptionsButton
                  url="/profile/edit"
                  text={t('edit')}
                  icon={<IconEdit />}
                />
                <MoreOptionsButton
                  url="/profile/preferences"
                  text={t('preferences')}
                  icon={<IconAdjustmentsHorizontal />}
                />

                <div className="px-4 py-2">
                  <Divider />
                </div>

                <MoreOptionsButton
                  url="/profile/app-settings"
                  text={t('app-settings')}
                  icon={<IconSettings />}
                />
                {session ? (
                  <MoreOptionsButton
                    onClick={() => signOut({ callbackUrl: '/' })}
                    text={t('logout')}
                    icon={<IconLogout />}
                  />
                ) : (
                  <MoreOptionsButton
                    onClick={() => signIn()}
                    text={t('login')}
                    icon={<IconLogin />}
                  />
                )}

                <div className="px-4 py-2">
                  <Divider />
                </div>

                <LanguageSwitcher className="mb-1 w-full max-w-none px-4" />

                <MoreOptionsButton
                  url="/support"
                  text={t('support')}
                  icon={<IconHelpCircle />}
                  isExternal
                />
                <MoreOptionsButton
                  url="/support/feedback"
                  text={t('feedback')}
                  icon={<IconMessage />}
                  isExternal
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

const MoreOptionsButton: FC<{
  url?: string
  onClick?: () => void
  text: string
  icon: ReactNode
  isExternal?: boolean
}> = ({ url, icon, text, isExternal, onClick }) => {
  if (url && onClick) throw new Error('You can only use one of url or onClick')

  return (
    <Button
      as={url ? Link : undefined}
      href={url}
      onClick={onClick}
      variant="light"
      fullWidth
      startContent={icon}
      endContent={
        isExternal && (
          <IconExternalLink className="text-stone-400 transition-colors group-hover:text-stone-800" />
        )
      }
    >
      <span className="flex-grow text-left">{text}</span>
    </Button>
  )
}
