'use client'

import { Button } from '@nextui-org/button'
import { IconCurrentLocation } from '@tabler/icons-react'
import { FC, useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'
import '../../../../public/lib/L.Control.Locate.min.css'

let hasImportedLocateControl = false

export const CustomLocationControl: FC<{ hide?: boolean }> = ({ hide }) => {
  const parentMap = useMap()

  const [elementWithClickEvent, setElementWithClickEvent] =
    useState<HTMLElement | null>(null)

  useEffect(() => {
    if (parentMap) {
      ;(async () => {
        if (!hasImportedLocateControl) {
          await import('leaflet.locatecontrol')
          hasImportedLocateControl = true
        }

        const L = (await import('leaflet')).default
        const lc = L.control.locate({
          flyTo: true,
          showPopup: false,
        })
        lc.addTo(parentMap)

        const container = lc.getContainer()
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

        return () => {
          lc.remove()
        }
      })()
    }
  }, [parentMap])

  return (
    <>
      {!hide && elementWithClickEvent && (
        <Button
          onPress={() => {
            elementWithClickEvent.click()
          }}
          size="lg"
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
