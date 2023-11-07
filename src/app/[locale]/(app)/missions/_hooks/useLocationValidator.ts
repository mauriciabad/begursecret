import haversine from 'haversine-distance'
import { useState } from 'react'
import { MapPoint } from '~/helpers/spatial-data'

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

export function useLocationValidator(expectedLocation: MapPoint) {
  const [deviceLocationError, setDeviceLocationError] =
    useState<null | ErrorCodes>(null)
  const [loadingDeviceLocation, setLoadingDeviceLocation] = useState(false)

  /**
   * Requests access to the device location and validates that it is closes than {@link MAX_DISTANCE_TO_PLACE}.
   *
   * If the location is not valid, it sets the error code in {@link deviceLocationError}.
   *
   * It automatically sets {@link loadingDeviceLocation} while the location is being accessed.
   * @returns {Promise<MapPoint | null>} {@link MapPoint} if the location is valid, {@link null} otherwise.
   */
  const validateLocation = async (): Promise<MapPoint | null> => {
    setLoadingDeviceLocation(true)

    const data = await new Promise<
      | {
          error: null
          location: MapPoint
        }
      | {
          error: ErrorCodes
          location: MapPoint | null
        }
    >((resolve) => {
      if (!('geolocation' in navigator)) {
        return resolve({
          error: 'geolocation-not-supported',
          location: null,
        })
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const deviceLocation: MapPoint = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          const distance = haversine(deviceLocation, expectedLocation)
          if (distance > MAX_DISTANCE_TO_PLACE) {
            return resolve({
              error: 'too-far',
              location: deviceLocation,
            })
          }

          const accuracy = position.coords.accuracy
          if (accuracy > MIN_LOCATION_ACCURACY) {
            return resolve({
              error: 'too-low-accuracy',
              location: deviceLocation,
            })
          }

          return resolve({ location: deviceLocation, error: null })
        },
        (error) => {
          if (error.POSITION_UNAVAILABLE) {
            return resolve({ error: 'position-unavailable', location: null })
          } else if (error.TIMEOUT) {
            return resolve({ error: 'timeout', location: null })
          } else if (error.PERMISSION_DENIED) {
            return resolve({ error: 'permission-denied', location: null })
          } else {
            return resolve({ error: 'position-unavailable', location: null })
          }
        },
        {
          enableHighAccuracy: true,
        }
      )
    })

    setLoadingDeviceLocation(false)

    setDeviceLocationError(data.error)

    return data.error ? null : data.location
  }

  return {
    validateLocation,
    deviceLocationError,
    loadingDeviceLocation,
  }
}
