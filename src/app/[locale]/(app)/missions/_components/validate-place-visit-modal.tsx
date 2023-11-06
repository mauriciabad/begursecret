import { Button } from '@nextui-org/button'
import { Card } from '@nextui-org/card'
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
  IconQrcodeOff,
} from '@tabler/icons-react'
import haversine from 'haversine-distance'
import { useTranslations } from 'next-intl'
import { FC, useState } from 'react'
import { AlertBox } from '~/components/generic/alert-box'
import { DividerWithText } from '~/components/generic/divider-with-text'
import { MapPoint } from '~/helpers/spatial-data'
import { useDevicePermissions } from '~/helpers/useDevicePermissions'

/** In meters */
const MAX_DISTANCE_TO_PLACE = process.env.NODE_ENV === 'development' ? 500 : 25

export const ValidatePlaceVisitModal: FC<
  Omit<ModalProps, 'children'> & {
    onValidate: (hasBeenVerified: boolean) => void
    expectedLocation: MapPoint
  }
> = ({ isOpen, onOpenChange, onValidate, expectedLocation }) => {
  const t = useTranslations('validate')
  const [deviceLocationError, setDeviceLocationError] = useState<
    | null
    | 'too-low-accuracy'
    | 'too-far'
    | 'geolocation-not-supported'
    | 'timeout'
    | 'position-unavailable'
    | 'permission-denied'
  >(null)
  const { state: locationPermission } = useDevicePermissions({
    name: 'geolocation',
  })
  const [loadingDeviceLocation, setLoadingDeviceLocation] = useState(false)

  const validate = ({ onClose }: { onClose: () => void }) => {
    setLoadingDeviceLocation(true)

    if (!('geolocation' in navigator)) {
      setDeviceLocationError('geolocation-not-supported')
      setLoadingDeviceLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const deviceLocation: MapPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        const distance = haversine(deviceLocation, expectedLocation)
        if (distance > MAX_DISTANCE_TO_PLACE) {
          setDeviceLocationError('too-far')
          setLoadingDeviceLocation(false)
          return
        }

        const accuracy = position.coords.accuracy
        if (accuracy > MAX_DISTANCE_TO_PLACE) {
          setDeviceLocationError('too-low-accuracy')
          setLoadingDeviceLocation(false)
          return
        }

        setDeviceLocationError(null)
        setLoadingDeviceLocation(false)
        onValidate(true)
        onClose()
      },
      (error) => {
        setLoadingDeviceLocation(false)
        setDeviceLocationError(
          error.POSITION_UNAVAILABLE
            ? 'position-unavailable'
            : error.TIMEOUT
            ? 'timeout'
            : error.PERMISSION_DENIED
            ? 'permission-denied'
            : 'position-unavailable'
        )
        throw error
      },
      {
        enableHighAccuracy: true,
      }
    )
  }
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {t('validate-visit')}
            </ModalHeader>
            <ModalBody className="block space-y-2 pb-6 pt-0">
              <>
                <Card className="mb-4 space-y-2 p-4 text-center">
                  <div className="mx-auto inline-block rounded-full bg-primary-50 p-4 text-primary-900">
                    <IconQrcodeOff size={24 * 2} stroke={1.5} />
                  </div>
                  <p className="text-balance font-bold">
                    {t('place-has-no-code')}
                  </p>
                  <p className="text-balance">
                    {t('use-device-location-to-validate')}
                  </p>
                </Card>

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
                  onPress={() => {
                    validate({ onClose })
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
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
