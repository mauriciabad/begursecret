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
import haversine from 'haversine-distance'
import { useSession } from 'next-auth/react'
import { useLogger } from 'next-axiom'
import { useTranslations } from 'next-intl'
import { FC, useState } from 'react'
import { AlertBox } from '~/components/generic/alert-box'
import { DividerWithText } from '~/components/generic/divider-with-text'
import { ExplanationCard } from '~/components/generic/explanation-card'
import { LinkButton } from '~/components/links/link-button'
import { MapPoint } from '~/helpers/spatial-data'
import { useDevicePermissions } from '~/helpers/useDevicePermissions'

/** In meters */
const MAX_DISTANCE_TO_PLACE = process.env.NODE_ENV === 'development' ? 500 : 25

/** In meters */
const MIN_LOCATION_ACCURACY = 50

type ErrorCodes =
  | 'too-low-accuracy'
  | 'too-far'
  | 'geolocation-not-supported'
  | 'timeout'
  | 'position-unavailable'
  | 'permission-denied'

export const ValidatePlaceVisitModal: FC<
  Omit<ModalProps, 'children'> & {
    onValidate: (hasBeenVerified: boolean) => void
    expectedLocation: MapPoint
    placeId: number
  }
> = ({ isOpen, onOpenChange, onValidate, expectedLocation, placeId }) => {
  const t = useTranslations('validate')
  const [deviceLocationError, setDeviceLocationError] =
    useState<null | ErrorCodes>(null)
  const { state: locationPermission } = useDevicePermissions({
    name: 'geolocation',
  })
  const [loadingDeviceLocation, setLoadingDeviceLocation] = useState(false)
  const log = useLogger()
  const { data: session } = useSession()

  /**
   * Requests access to the device location and validates that it is closes than {@link MAX_DISTANCE_TO_PLACE}.
   *
   * If the location is not valid, it sets the error code in {@link deviceLocationError}.
   *
   * It automatically sets {@link loadingDeviceLocation} while the location is being accessed.
   * @returns {Promise<boolean>} true if the location is valid
   */
  const validateLocation = async (): Promise<boolean> => {
    setLoadingDeviceLocation(true)

    const errorCode = await new Promise<ErrorCodes | null>((resolve) => {
      if (!('geolocation' in navigator)) {
        return resolve('geolocation-not-supported')
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const deviceLocation: MapPoint = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          const distance = haversine(deviceLocation, expectedLocation)
          if (distance > MAX_DISTANCE_TO_PLACE) {
            return resolve('too-far')
          }

          const accuracy = position.coords.accuracy
          if (accuracy > MIN_LOCATION_ACCURACY) {
            return resolve('too-low-accuracy')
          }

          return resolve(null)
        },
        (error) => {
          if (error.POSITION_UNAVAILABLE) {
            return resolve('position-unavailable')
          } else if (error.TIMEOUT) {
            return resolve('timeout')
          } else if (error.PERMISSION_DENIED) {
            return resolve('permission-denied')
          } else {
            return resolve('position-unavailable')
          }
        },
        {
          enableHighAccuracy: true,
        }
      )
    })

    setLoadingDeviceLocation(false)

    setDeviceLocationError(errorCode)

    return errorCode === null
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
                      const isLocationValid = await validateLocation()

                      if (isLocationValid) {
                        log.info('Place visit validated', {
                          placeId,
                          userId: session.user.id,
                        })
                        onValidate(true)
                        onClose()
                      } else {
                        log.error('Place visit validation failed', {
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
                      loadingDeviceLocation || locationPermission === 'denied'
                    }
                  >
                    {loadingDeviceLocation
                      ? t('accessing-location')
                      : t('validate-visit')}
                  </Button>

                  <DividerWithText text={t('or')} />

                  <Button
                    fullWidth
                    onPress={() => {
                      onValidate(false)
                      onClose()
                    }}
                    startContent={
                      <IconCircleCheck className="text-stone-700" size={20} />
                    }
                  >
                    {t('continue-without-validating')}
                  </Button>
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
