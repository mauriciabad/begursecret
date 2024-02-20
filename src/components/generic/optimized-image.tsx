import { Image, type ImageProps } from '@nextui-org/image'
import NextImage, {
  StaticImageData,
  type ImageProps as NextImageProps,
} from 'next/image'
import { FC } from 'react'
import { cn } from '~/helpers/cn'
import { ImageType, makeImageUrl } from '~/helpers/images'
import fallbackImage from '../../../public/fallback.png'

type S3Image = Omit<ImageType, 'id'>

type StaticImage = {
  src: string
  height: number
  width: number
  blurDataURL?: string
  alt?: string
}

function imageIsFromS3(image: S3Image | StaticImage): image is S3Image {
  return 'key' in image
}

function imageToStatic(image: S3Image): StaticImage {
  return {
    src: makeImageUrl(image.key),
    width: image.width,
    height: image.height,
    alt: image?.alt ?? undefined,
    blurDataURL: image?.blurDataURL ?? undefined,
  }
}

const FALLBACK_IMG_ALT = 'Imatge de mostra'

export const OptimizedImage: FC<
  Omit<ImageProps & NextImageProps, 'src' | 'width' | 'height' | 'alt'> & {
    image?: S3Image | StaticImageData | null
    alt?: string
  }
> = ({ image, alt, className, ...imageProps }) => {
  const actualImage: StaticImage = image
    ? imageIsFromS3(image)
      ? imageToStatic(image)
      : image
    : { ...fallbackImage, alt: FALLBACK_IMG_ALT }

  return (
    <Image
      as={NextImage}
      src={actualImage.src}
      width={actualImage.width}
      height={actualImage.height}
      blurDataURL={actualImage.blurDataURL}
      alt={alt ?? actualImage.alt}
      placeholder={actualImage.blurDataURL ? 'blur' : 'empty'}
      className={cn('h-auto w-auto', className)}
      {...imageProps}
    />
  )
}
