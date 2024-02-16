'use client'

import { Accordion, AccordionItem } from '@nextui-org/accordion'
import { Button } from '@nextui-org/button'
import { CircularProgress } from '@nextui-org/progress'
import { useDisclosure } from '@nextui-org/use-disclosure'
import {
  IconChevronRight,
  IconCircle,
  IconCircleCheckFilled,
  IconDiscountCheckFilled,
  IconMap,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC, useState } from 'react'
import { colorClasses } from '~/app/[locale]/layout'
import { PlaceCategoryIcon } from '~/components/icons/place-category-icon'
import { LinkButton } from '~/components/links/link-button'
import { cn } from '~/helpers/cn'
import { ApiRouterOutput } from '~/server/api/router'
import {
  PlaceCategoryColor,
  PlaceCategoryIcon as PlaceCategoryIconType,
} from '~/server/db/constants/places'
import { PlacePreviewModal } from './place-prevew-modal'

type VisitMissions = ApiRouterOutput['missions']['getVisitMissions']
type VisitMissionPlace = VisitMissions[number]['places'][number]

export const VisitMissionsAcordion: FC<{
  visitMissions: VisitMissions
}> = ({ visitMissions }) => {
  const t = useTranslations('missions')
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [modalPlacePartialInfo, setModalPlacePartialInfo] =
    useState<VisitMissionPlace | null>(null)

  return (
    <>
      <Accordion
        variant="splitted"
        fullWidth
        className="p-0"
        selectionMode="multiple"
      >
        {visitMissions.map(({ category, places }) => (
          <AccordionItem
            key={category.id}
            title={category.namePlural}
            classNames={{
              base: '!p-0 !shadow-small',
              trigger: 'py-2 pl-2 pr-4',
              content: 'p-0',
              title: 'text-gray-700 font-title text-lg font-semibold',
            }}
            startContent={
              <PlaceCategoryIconWithProgress
                icon={category.icon}
                progress={
                  places.filter((place) => place.visited).length / places.length
                }
                color={category.color}
                label={category.namePlural}
              />
            }
          >
            <div className="p-1">
              <LinkButton
                className="border px-2 py-0 leading-none"
                radius="full"
                variant="bordered"
                fullWidth
                size="sm"
                startContent={<IconMap size={18} className="text-stone-400" />}
                endContent={
                  <IconChevronRight size={18} className="text-stone-300" />
                }
                href={`/explore/search?category=${category.id}`}
              >
                <span className="grow text-left">
                  {t('view-places-in-map')}
                </span>
              </LinkButton>
            </div>
            <ul className="py-1">
              {places.map((place) => (
                <li key={place.id}>
                  <Button
                    className="flex w-full items-center justify-start gap-2 px-2 py-1"
                    radius="none"
                    variant="light"
                    onPress={() => {
                      setModalPlacePartialInfo(place)
                      onOpen()
                    }}
                  >
                    {place.verifications.length > 0 ? (
                      <IconDiscountCheckFilled
                        size={24}
                        className="text-blue-400"
                        aria-label={t('verified')}
                      />
                    ) : place.visited ? (
                      <IconCircleCheckFilled
                        size={24}
                        className="text-blue-400"
                        aria-label={t('visited')}
                      />
                    ) : (
                      <IconCircle
                        size={24}
                        className="text-stone-500"
                        aria-label={t('not-visited')}
                      />
                    )}

                    <span className="grow text-left">{place.name}</span>

                    <IconChevronRight size={24} className="text-stone-300" />
                  </Button>
                </li>
              ))}
            </ul>
          </AccordionItem>
        ))}
      </Accordion>
      <PlacePreviewModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        place={modalPlacePartialInfo}
      />
    </>
  )
}

const PlaceCategoryIconWithProgress: FC<{
  icon: PlaceCategoryIconType | null
  progress: number
  color: PlaceCategoryColor
  label: string
}> = ({ icon, progress, color, label }) => {
  return (
    <div className="relative">
      {progress >= 1 ? (
        <div className="p-1">
          <div
            className={cn(
              'h-10 w-10 rounded-full',
              color && [colorClasses.bg[color]]
            )}
          />
        </div>
      ) : (
        <CircularProgress
          value={progress}
          aria-label={label}
          minValue={0}
          maxValue={1}
          size="lg"
          classNames={{
            indicator: cn(color && [colorClasses.stroke[color]]),
            track: cn(color && [colorClasses.stroke20[color]]),
          }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <PlaceCategoryIcon
          icon={icon}
          className={cn(color && [colorClasses.text[color]], {
            'text-white': progress >= 1,
          })}
        />
      </div>
    </div>
  )
}
