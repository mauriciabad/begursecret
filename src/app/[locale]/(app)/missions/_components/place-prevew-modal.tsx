'use client'

import { Image } from '@nextui-org/image'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from '@nextui-org/modal'
import { IconChevronRight, IconInfoCircle } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { FC } from 'react'
import { LinkButton } from '~/components/links/link-button'
import { Map } from '~/components/map/map'
import { PlaceCategoryTagList } from '~/components/place-category-tags/place-category-tag-list'
import { shotConfettiStars } from '~/helpers/confetti'
import { makeImageUrl } from '~/helpers/images'
import { VisitMissionPlace } from '~/server/db/constants/missions'
import { VerificateButton } from './verificate-button'

export const PlacePreviewModal: FC<
  Omit<ModalProps, 'children'> & {
    place: VisitMissionPlace | null
  }
> = ({ isOpen, onOpenChange, place }) => {
  const t = useTranslations('missions')
  const isFar =
    place &&
    (place.location.lng < 3.170467 ||
      place.location.lng > 3.24022 ||
      place.location.lat < 41.920697 ||
      place.location.lat > 41.984129)

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
                <LinkButton
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
                </LinkButton>

                <VerificateButton
                  expectedLocation={place.location}
                  placeId={place.id}
                  isAlreadyVisited={place.missionStatus.visited}
                  isAlreadyVerified={place.missionStatus.verified}
                  verificationRequirements={place.verificationRequirements}
                  onVerificate={(verificated) => {
                    shotConfettiStars({ withStars: verificated })
                    onClose()
                  }}
                />
              </ModalFooter>
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
