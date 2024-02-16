'use client'

import { Button } from '@nextui-org/button'
import { IconNavigationNorth } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, useEffect, useId, useState } from 'react'
import { useMap } from 'react-leaflet'
import { cn } from '~/helpers/cn'

const MotionButton = motion(Button)

export const CustomRotationControl: FC<{ hide?: boolean }> = ({ hide }) => {
  const parentMap = useMap()
  const [bearing, setBearing] = useState<number>(0)
  const key = useId()

  useEffect(() => {
    if (parentMap) {
      parentMap.on('rotate', () => {
        setBearing(parentMap.getBearing())
      })

      return () => {
        parentMap.off('rotate')
      }
    }
  }, [parentMap])

  return (
    <AnimatePresence>
      {!hide && bearing !== 0 && (
        <MotionButton
          onPress={() => {
            parentMap.setBearing(0)
          }}
          size="lg"
          isIconOnly
          variant="solid"
          className={cn('rounded-full bg-white shadow-md')}
          key={key}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <IconNavigationNorth
            size={32}
            stroke={1.5}
            style={{ transform: `rotate(${bearing}deg)` }}
          />
        </MotionButton>
      )}
    </AnimatePresence>
  )
}
