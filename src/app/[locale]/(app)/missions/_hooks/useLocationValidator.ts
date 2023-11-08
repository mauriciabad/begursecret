import haversine from 'haversine-distance'
import { useCallback, useEffect, useState } from 'react'
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
  | 'permission-not-granted-yet'

export function useLocationValidator(expectedLocation: MapPoint) {
  const [deviceLocationError, setDeviceLocationError] =
    useState<null | ErrorCodes>(null)
  const [loadingDeviceLocation, setLoadingDeviceLocation] = useState(false)

  const locationPermission = useDevicePermissions('geolocation')
  useEffect(() => {
    if (!locationPermission) return
    if (locationPermission.state === 'granted') {
      if (
        deviceLocationError === 'permission-denied' ||
        deviceLocationError === 'permission-not-granted-yet'
      ) {
        setDeviceLocationError(null)
      }
    } else {
      setDeviceLocationError(
        locationPermission.state === 'denied'
          ? 'permission-denied'
          : 'permission-not-granted-yet'
      )
    }
  }, [locationPermission])

  /**
   * Requests access to the device location and validates that it is closes than {@link MAX_DISTANCE_TO_PLACE}.
   *
   * If the location is not valid, it sets the error code in {@link deviceLocationError}.
   *
   * It automatically sets {@link loadingDeviceLocation} while the location is being accessed.
   * @returns {Promise<MapPoint | null>} {@link MapPoint} if the location is valid, {@link null} otherwise.
   */
  const validateLocation = useCallback<
    () => Promise<{ location: MapPoint; accuracy: number } | null>
  >(async () => {
    setLoadingDeviceLocation(true)

    const { error, data } = await new Promise<
      | {
          error: null
          data: { location: MapPoint; accuracy: number }
        }
      | {
          error: ErrorCodes
          data: { location: MapPoint; accuracy: number } | null
        }
    >((resolve) => {
      if (!('geolocation' in navigator)) {
        return resolve({
          error: 'geolocation-not-supported',
          data: null,
        })
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const deviceGeolocation = {
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            accuracy: position.coords.accuracy,
          } as const

          const distance = haversine(
            deviceGeolocation.location,
            expectedLocation
          )
          if (distance > MAX_DISTANCE_TO_PLACE) {
            return resolve({
              error: 'too-far',
              data: deviceGeolocation,
            })
          }

          if (deviceGeolocation.accuracy > MIN_LOCATION_ACCURACY) {
            return resolve({
              error: 'too-low-accuracy',
              data: deviceGeolocation,
            })
          }

          return resolve({ data: deviceGeolocation, error: null })
        },
        (error) => {
          if (error.POSITION_UNAVAILABLE) {
            return resolve({ error: 'position-unavailable', data: null })
          } else if (error.TIMEOUT) {
            return resolve({ error: 'timeout', data: null })
          } else if (error.PERMISSION_DENIED) {
            return resolve({ error: 'permission-denied', data: null })
          } else {
            return resolve({ error: 'position-unavailable', data: null })
          }
        },
        {
          enableHighAccuracy: true,
        }
      )
    })

    setLoadingDeviceLocation(false)

    setDeviceLocationError(error)

    return error ? null : data
  }, [expectedLocation])

  return {
    validateLocation,
    deviceLocationError,
    loadingDeviceLocation,
  }
}
