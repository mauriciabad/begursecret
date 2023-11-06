import { Button } from '@nextui-org/button'
import { Image } from '@nextui-org/image'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from '@nextui-org/modal'
import { useDisclosure } from '@nextui-org/react'
import {
  IconChevronRight,
  IconDiscountCheckFilled,
  IconInfoCircle,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { FC } from 'react'
import { Map } from '~/components/map/map'
import { PlaceCategoryTagList } from '~/components/place-category-tags/place-category-tag-list'
import { shotConfettiStars } from '~/helpers/confetti'
import { makeImageUrl } from '~/helpers/images'
import {
  PlaceCategoryColor,
  PlaceCategoryIcon as PlaceCategoryIconType,
} from '~/server/db/constants/places'
import { ValidatePlaceVisitModal } from './validate-place-visit-modal'

export const PlacePreviewModal: FC<
  Omit<ModalProps, 'children'> & {
    place: {
      id: number
      name: string
      description: string | null
      mainImage: string | null
      images: { key: string }[]
      mainCategory: {
        icon: PlaceCategoryIconType
        name: string
        color: PlaceCategoryColor
      }
      categories: {
        icon: PlaceCategoryIconType
        name: string
      }[]
      location: {
        lat: number
        lng: number
      }
    } | null
  }
> = ({ isOpen, onOpenChange, place }) => {
  const t = useTranslations('missions')
  const isFar =
    place &&
    (place.location.lng < 3.170467 ||
      place.location.lng > 3.24022 ||
      place.location.lat < 41.920697 ||
      place.location.lat > 41.984129)

  const {
    isOpen: isValidateModalOpen,
    onOpen: onValidateModalOpen,
    onOpenChange: onValidateModalOpenChange,
  } = useDisclosure()

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) =>
          place ? (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {place.name}
              </ModalHeader>
              <ModalBody className="py-0">
                <>
                  <div className="-mx-6 flex h-32 gap-2 overflow-x-auto px-6 [&>*]:shrink-0">
                    <Link
                      href={`/explore/places/${place.id}`}
                      className="outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <Map
                        className="aspect-[3/4] h-full w-auto rounded-md"
                        zoom={isFar ? 10 : 11}
                        center={
                          isFar
                            ? { lat: 41.94, lng: 3.18 }
                            : { lat: 41.953, lng: 3.205 }
                        }
                        defaultLayer="bg-satelite-ign"
                        markers={[
                          {
                            location: place.location,
                            icon: place.mainCategory.icon,
                            color: 'red',
                            size: 'tiny',
                          },
                        ]}
                      />
                    </Link>
                    <Image
                      radius="md"
                      alt={place.name}
                      className="h-full"
                      src={makeImageUrl(place.mainImage)}
                    />
                    {place.images?.map((image) => (
                      <Image
                        radius="lg"
                        shadow="sm"
                        alt={place.name}
                        className="h-full object-cover"
                        src={makeImageUrl(image.key)}
                      />
                    ))}
                  </div>
                  <div className="overflow-x-auto">
                    <PlaceCategoryTagList
                      mainCategory={place.mainCategory}
                      categories={place.categories}
                    />
                  </div>
                  {place.description && <p>{place.description}</p>}{' '}
                </>
              </ModalBody>
              <ModalFooter className="block space-y-2">
                <Button
                  as={Link}
                  className="px-2"
                  variant="bordered"
                  fullWidth
                  startContent={
                    <IconInfoCircle size={20} className="text-stone-400" />
                  }
                  endContent={
                    <IconChevronRight
                      size={20}
                      className="-mx-1 text-stone-400"
                    />
                  }
                  href={`/explore/places/${place.id}`}
                >
                  <span className="grow text-left leading-none">
                    {t('view-full-place-info')}
                  </span>
                </Button>
                <Button
                  color="primary"
                  fullWidth
                  onPress={onValidateModalOpen}
                  startContent={<IconDiscountCheckFilled size={20} />}
                >
                  {t('validate-visit')}
                </Button>
              </ModalFooter>

              <ValidatePlaceVisitModal
                isOpen={isValidateModalOpen}
                onOpenChange={onValidateModalOpenChange}
                expectedLocation={place.location}
                onValidate={(validated) => {
                  shotConfettiStars({ withStars: validated })
                  onClose()
                }}
              />
            </>
          ) : (
            <ModalBody className="">
              <p>{t('no-place-selected')}</p>
            </ModalBody>
          )
        }
      </ModalContent>
    </Modal>
  )
}
