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
  Icon,
  IconExternalLink,
  IconLock,
  IconMailForward,
  IconMenu2,
} from '@tabler/icons-react'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { LanguageSwitcher } from '~/components/inputs/language-switcher'
import { Link } from '~/navigation'

type MoreOptionsModalProps = PropsWithChildren<{
  title: string
}>

export const MoreOptionsModal: FC<MoreOptionsModalProps> = ({
  title,
  children,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button
        // Should use onPress but there's a bug https://github.com/nextui-org/nextui/issues/1796
        onClick={onOpen}
        isIconOnly
        aria-label={title}
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
                <h2 className="font-title">{title}</h2>
              </ModalHeader>

              <ModalBody>{children}</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

const icons = {
  'external-link': IconExternalLink,
  lock: IconLock,
  'mail-forward': IconMailForward,
} as const satisfies Record<string, Icon>

type IconName = keyof typeof icons

export const MoreOptionsModalButton: FC<{
  url?: string
  onClick?: () => void
  text: string
  icon: ReactNode
  secondaryIcon?: IconName
}> = ({ url, icon, text, onClick, secondaryIcon }) => {
  if (url && onClick) throw new Error('You can only use one of url or onClick')

  const Icon = secondaryIcon ? icons[secondaryIcon] : undefined

  return (
    <Button
      as={url ? Link : undefined}
      href={url}
      onClick={onClick}
      variant="light"
      fullWidth
      startContent={icon}
      endContent={
        Icon && (
          <Icon className="text-stone-400 transition-colors group-hover:text-stone-800" />
        )
      }
    >
      <span className="flex-grow text-left">{text}</span>
    </Button>
  )
}

export const MoreOptionsModalDivider: FC = () => (
  <div className="px-4 py-2">
    <Divider />
  </div>
)

export const MoreOptionsModalLanguageSwitcher: FC = () => (
  <LanguageSwitcher className="mb-1 w-full max-w-none px-4" />
)
