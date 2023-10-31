import { Button } from '@nextui-org/button'
import { IconCurrentLocation } from '@tabler/icons-react'
import L from 'leaflet'
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import 'leaflet/dist/leaflet.css'
import { FC, useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'

export const CustomLocationControl: FC = () => {
  const parentMap = useMap()

  const locationControl = L.control.locate({
    flyTo: true,
    showPopup: false,
  })

  const [elementWithClickEvent, setElementWithClickEvent] =
    useState<HTMLElement | null>(null)

  useEffect(() => {
    if (parentMap) {
      locationControl.addTo(parentMap)
      const container = locationControl.getContainer()
      if (!container) throw new Error('No container for location control')
      container.style.display = 'none'

      const child = container.firstChild
      if (!child) {
        throw new Error('No child for location control')
      }
      if (!(child instanceof HTMLElement)) {
        throw new Error('Child is not HTMLElement in location control')
      }

      setElementWithClickEvent(child)
    }
  }, [parentMap])

  return (
    <>
      {elementWithClickEvent && (
        <Button
          onPress={() => {
            elementWithClickEvent.click()
          }}
          isIconOnly
          aria-label="Test"
          variant="solid"
          className="rounded-full bg-white shadow-md"
        >
          <IconCurrentLocation />
        </Button>
      )}
    </>
  )
}
