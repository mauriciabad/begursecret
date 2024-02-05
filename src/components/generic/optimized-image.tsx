import { Image, type ImageProps } from '@nextui-org/image'
import NextImage, {
  StaticImageData,
  type ImageProps as NextImageProps,
} from 'next/image'
import { FC } from 'react'
import fallbackImage from '~/../public/fallback.png'
import { env } from '~/env.mjs'
import { ImageType, makeImageUrl } from '~/helpers/images'

type ImageWithoutId = Omit<ImageType, 'id'>

function imageIsStatic(
  image: ImageWithoutId | StaticImageData
): image is StaticImageData {
  return 'src' in image
}

function imageToStatic(image: ImageWithoutId): StaticImageData {
  return {
    src: makeImageUrl(image.key),
    width: image.width,
    height: image.height,
  }
}

export const OptimizedImage: FC<
  Omit<ImageProps & NextImageProps, 'src' | 'width' | 'height' | 'alt'> & {
    image?: ImageWithoutId | StaticImageData | null
    alt?: string
  }
> = ({ image, alt, ...imageProps }) => {
  const actualImage: StaticImageData = image
    ? imageIsStatic(image)
      ? image
      : imageToStatic(image)
    : fallbackImage
  const actualAlt: string | undefined =
    alt ?? (!image || imageIsStatic(image) ? undefined : image.alt ?? undefined)
  const isProduction =
    env.NODE_ENV === 'production' && env.VERCEL_ENV === 'production'

  return (
    <Image
      as={NextImage}
      src={actualImage.src}
      width={actualImage.width}
      height={actualImage.height}
      blurDataURL={actualImage.blurDataURL}
      alt={actualAlt}
      {...imageProps}
      unoptimized={!isProduction}
    />
  )
}
