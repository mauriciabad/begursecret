import { Image } from '@nextui-org/image'
import { ImageProps } from '@nextui-org/react'
import NextImage, { type ImageProps as NextImageProps } from 'next/image'
import { FC } from 'react'
import { ImageType, makeImageUrl } from '~/helpers/images'

type ImageWithoutId = Omit<ImageType, 'id'>

const DEFAULT_IMAGE = {
  key: 'static/app/content-placeholder.png',
  width: 667,
  height: 667,
  alt: '',
} as const satisfies ImageWithoutId

export const OptimizedImage: FC<
  Omit<ImageProps & NextImageProps, 'src' | 'width' | 'height' | 'alt'> & {
    image?: ImageWithoutId | null
    alt?: string
  }
> = ({ image, alt, ...imageProps }) => {
  const actualImage = image ?? DEFAULT_IMAGE
  return (
    <Image
      as={NextImage}
      src={makeImageUrl(actualImage.key)}
      width={actualImage.width}
      height={actualImage.height}
      alt={alt ?? actualImage.alt ?? undefined}
      {...imageProps}
    />
  )
}
