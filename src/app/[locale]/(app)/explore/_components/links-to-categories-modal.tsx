'use client'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  useDisclosure,
} from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { PlaceMarker } from '~/components/generic/place-marker'
import { Link } from '~/navigation'
import { ApiRouterOutput } from '~/server/api/router'

type PlaceCategoryGroup = NonNullable<
  ApiRouterOutput['explore']['listCategoryGroups']
>[number]

export const LinksToCategoriesModal: FC<{
  group: PlaceCategoryGroup
}> = ({ group }) => {
  const t = useTranslations('explore')
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button
        variant="bordered"
        radius="full"
        onClick={onOpen}
        className="mx-auto flex"
      >
        {t('see-all-categories')}
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {group.name}
              </ModalHeader>
              <ModalBody>
                <ScrollShadow>
                  <ul>
                    {group.placeCategories.map(({ category }) => (
                      <Button
                        as={Link}
                        key={category.id}
                        href={`/explore/search?placeCategory=${category.id}`}
                        variant="light"
                        fullWidth
                        className="flex items-center justify-start px-2"
                        startContent={
                          <PlaceMarker
                            icon={category.icon}
                            color={category.color}
                            size="md"
                          />
                        }
                      >
                        {category.namePlural}
                      </Button>
                    ))}
                  </ul>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button
                  fullWidth
                  color="primary"
                  variant="light"
                  onPress={onClose}
                >
                  {t('close')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
