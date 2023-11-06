'use client'

import { Button } from '@nextui-org/button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
} from '@nextui-org/modal'
import {
  IconCircleCheck,
  IconDiscountCheckFilled,
  IconLoader,
  IconLogin2,
  IconQrcodeOff,
  IconUser,
  IconUserPlus,
} from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useLogger } from 'next-axiom'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { AlertBox } from '~/components/generic/alert-box'
import { DividerWithText } from '~/components/generic/divider-with-text'
import { ExplanationCard } from '~/components/generic/explanation-card'
import { LinkButton } from '~/components/links/link-button'
import { MapPoint } from '~/helpers/spatial-data'
import { useDevicePermissions } from '~/helpers/useDevicePermissions'
import { trpc } from '~/trpc'
import { useLocationValidator } from '../_hooks/useLocationValidator'

type OnValidate = (
  hasBeenVerified: boolean,
  validationData: {
    location: MapPoint | null
  }
) => Promise<void> | void

export const ValidatePlaceVisitModal: FC<
  Omit<ModalProps, 'children'> & {
    onValidate: OnValidate
    expectedLocation: MapPoint
    placeId: number
    isAlreadyVisited: boolean
  }
> = ({
  isOpen,
  onOpenChange,
  onValidate,
  expectedLocation,
  placeId,
  isAlreadyVisited,
}) => {
  const t = useTranslations('validate')
  const { validateLocation, deviceLocationError, loadingDeviceLocation } =
    useLocationValidator(expectedLocation)
  const { state: locationPermission } = useDevicePermissions({
    name: 'geolocation',
  })
  const log = useLogger()
  const { data: session } = useSession()
  const addToVisitedPlacesMutation =
    trpc.placeLists.addToVisitedPlacesList.useMutation()

  const addToVisitedPlaces: OnValidate = async (
    hasBeenVerified,
    validationData
  ) => {
    if (!isAlreadyVisited) {
      await addToVisitedPlacesMutation.mutateAsync({
        placeId,
      })
    }
    if (hasBeenVerified) {
      // Add to validations
    }

    await onValidate(hasBeenVerified, validationData)
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {t('validate-visit')}
            </ModalHeader>

            {session ? (
              <ModalBody className="block space-y-2 pb-6 pt-0">
                <>
                  <ExplanationCard
                    icon={IconQrcodeOff}
                    title={t('place-has-no-code')}
                    subtitle={t('use-device-location-to-validate')}
                  />

                  {(!locationPermission || locationPermission === 'prompt') && (
                    <AlertBox type="warning">
                      {t('grant-location-permission-to-continue')}
                    </AlertBox>
                  )}

                  {locationPermission === 'denied' ||
                  deviceLocationError === 'permission-denied' ? (
                    <AlertBox type="error">
                      {t('device-location-errors.permission-denied')}
                    </AlertBox>
                  ) : (
                    deviceLocationError && (
                      <AlertBox type="error">
                        {t(`device-location-errors.${deviceLocationError}`)}
                      </AlertBox>
                    )
                  )}

                  <Button
                    color="primary"
                    fullWidth
                    onPress={async () => {
                      const validatedLocation = await validateLocation()

                      if (validatedLocation) {
                        log.info('Place visit location validated', {
                          placeId,
                          userId: session.user.id,
                          deviceLocation: validatedLocation,
                        })

                        await addToVisitedPlaces(true, {
                          location: validatedLocation,
                        })

                        onClose()
                      } else {
                        log.error('Place visit location validation failed', {
                          placeId,
                          userId: session.user.id,
                          error: deviceLocationError,
                        })
                      }
                    }}
                    startContent={
                      loadingDeviceLocation ? (
                        <IconLoader size={20} className="animate-spin" />
                      ) : (
                        <IconDiscountCheckFilled size={20} />
                      )
                    }
                    disabled={
                      loadingDeviceLocation ||
                      locationPermission === 'denied' ||
                      addToVisitedPlacesMutation.isLoading
                    }
                  >
                    {loadingDeviceLocation
                      ? t('accessing-location')
                      : addToVisitedPlacesMutation.isLoading
                      ? t('loading')
                      : t('validate-visit')}
                  </Button>

                  {!isAlreadyVisited && (
                    <>
                      <DividerWithText text={t('or')} />

                      <Button
                        fullWidth
                        onPress={async () => {
                          await addToVisitedPlaces(false, { location: null })
                          onClose()
                        }}
                        startContent={
                          <IconCircleCheck
                            className="text-stone-700"
                            size={20}
                          />
                        }
                        disabled={
                          loadingDeviceLocation ||
                          addToVisitedPlacesMutation.isLoading
                        }
                      >
                        {addToVisitedPlacesMutation.isLoading
                          ? t('loading')
                          : t('continue-without-validating')}
                      </Button>
                    </>
                  )}
                </>
              </ModalBody>
            ) : (
              <ModalBody className="block space-y-2 pb-6 pt-0">
                <>
                  <ExplanationCard
                    icon={IconUser}
                    title={t('login-required')}
                    subtitle={t('login-required-description')}
                  >
                    <div className="flex flex-wrap justify-center gap-2 py-4">
                      <LinkButton
                        href="/profile"
                        startContent={<IconLogin2 size={20} />}
                      >
                        {t('login')}
                      </LinkButton>
                      <LinkButton
                        color="primary"
                        href="/register"
                        startContent={<IconUserPlus size={20} />}
                      >
                        {t('register')}
                      </LinkButton>
                    </div>
                  </ExplanationCard>
                </>
              </ModalBody>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
