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
import { IconExternalLink, IconMenu2 } from '@tabler/icons-react'
import Link from 'next-intl/link'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { LanguageSwitcher } from '~/components/inputs/language-switcher'

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

export const MoreOptionsModalButton: FC<{
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

export const MoreOptionsModalDivider: FC = () => (
  <div className="px-4 py-2">
    <Divider />
  </div>
)

export const MoreOptionsModalLanguageSwitcher: FC = () => (
  <LanguageSwitcher className="mb-1 w-full max-w-none px-4" />
)
