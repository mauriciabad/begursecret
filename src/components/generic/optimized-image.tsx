import { Image } from '@nextui-org/image'
import { ImageProps } from '@nextui-org/react'
import NextImage, { type ImageProps as NextImageProps } from 'next/image'
import { FC } from 'react'
import { makeImageUrl } from '~/helpers/images'

export const OptimizedImage: FC<
  Omit<ImageProps & NextImageProps, 'src' | 'width' | 'height' | 'alt'> & {
    image: {
      key?: string | null
      width: number
      height: number
      alt?: string | null
    }
    alt?: string
  }
> = ({ image, alt, ...imageProps }) => {
  return (
    <Image
      as={NextImage}
      {...imageProps}
      src={makeImageUrl(image.key)}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt ?? undefined}
    />
  )
}
