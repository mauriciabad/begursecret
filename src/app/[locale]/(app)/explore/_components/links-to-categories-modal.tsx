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
import { CategoryGroupListItem } from './list-category-groups'

export const LinksToCategoriesModal: FC<{
  group: CategoryGroupListItem
}> = ({ group }) => {
  const t = useTranslations('explore')
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const sortedCategories = group.categories.sort((a, b) =>
    a.category.namePlural.localeCompare(b.category.namePlural)
  )

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
                    {sortedCategories.map(({ category }) => {
                      const categoryLink =
                        group.type === 'place'
                          ? (`/explore/search?placeCategory=${category.id}` as const)
                          : (`/explore/search?routeCategory=${category.id}` as const)

                      return (
                        <Button
                          as={Link}
                          role="link"
                          key={category.id}
                          href={categoryLink}
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
                      )
                    })}
                  </ul>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button fullWidth color="primary" onPress={onClose}>
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
