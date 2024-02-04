import { Image } from '@nextui-org/image'
import { ImageProps } from '@nextui-org/react'
import NextImage, { type ImageProps as NextImageProps } from 'next/image'
import { FC } from 'react'
import { makeImageUrl } from '~/helpers/images'

type Image = {
  key?: string
  width: number
  height: number
  alt?: string | null
}
const DEFAULT_IMAGE = {
  key: 'static/app/content-placeholder.png',
  width: 667,
  height: 667,
  alt: '',
} as const satisfies Image

export const OptimizedImage: FC<
  Omit<ImageProps & NextImageProps, 'src' | 'width' | 'height' | 'alt'> & {
    image?: Image | null
    alt?: string
  }
> = ({ image, alt, ...imageProps }) => {
  const actualImage = image ?? DEFAULT_IMAGE
  return (
    <Image
      as={NextImage}
      {...imageProps}
      src={makeImageUrl(actualImage.key)}
      width={actualImage.width}
      height={actualImage.height}
      alt={alt ?? actualImage.alt ?? undefined}
    />
  )
}
