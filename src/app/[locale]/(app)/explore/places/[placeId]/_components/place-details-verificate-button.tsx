'use client'

import { FC } from 'react'
import { shotConfettiStars } from '~/helpers/confetti'
import {
  VerificateButton,
  VerificateButtonProps,
} from '../../../../missions/_components/verificate-button'

export const PlaceDetailsVerificateButton: FC<VerificateButtonProps> = (
  props
) => {
  return (
    <VerificateButton
      {...props}
      onVerificate={(verificated) => {
        shotConfettiStars({ withStars: verificated })
      }}
    />
  )
}
