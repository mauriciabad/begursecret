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
  IconLogout,
  IconMenu2,
  IconMessage,
  IconSettings,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { FC, ReactNode } from 'react'

export const MoreOptionsModal: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const t = useTranslations('profile.more-options')

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
                {t('title')}
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
                <MoreOptionsButton
                  url="/profile/logout"
                  text={t('logout')}
                  icon={<IconLogout />}
                />

                <div className="px-4 py-2">
                  <Divider />
                </div>

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
  url: string
  text: string
  icon: ReactNode
  isExternal?: boolean
}> = ({ url, icon, text, isExternal }) => (
  <Button
    as={Link}
    href={url}
    variant="light"
    fullWidth
    startContent={icon}
    className="justify-start"
    endContent={isExternal && <IconExternalLink />}
  >
    {text}
  </Button>
)
