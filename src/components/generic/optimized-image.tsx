import { Image, type ImageProps } from '@nextui-org/image'
import NextImage, {
  StaticImageData,
  type ImageProps as NextImageProps,
} from 'next/image'
import { FC } from 'react'
import fallbackImage from '~/../public/fallback.png'
import { cn } from '~/helpers/cn'
import { ImageType, makeImageUrl } from '~/helpers/images'

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

/**
 * Without `sizes`, Next.js only generates a 1x/2x srcset based on the source
 * image width (up to 3840px). Content is at most max-w-2xl (672px) wide, so
 * default to that and let callers pass a smaller value for thumbnails.
 */
const DEFAULT_SIZES = '(max-width: 672px) 100vw, 672px'

const fullClassNames = {
  height: 'h-full w-auto',
  width: 'h-auto w-full',
  both: 'h-full w-full',
} as const satisfies Record<string, string>

export const OptimizedImage: FC<
  Omit<ImageProps & NextImageProps, 'src' | 'width' | 'height' | 'alt'> & {
    image?: S3Image | StaticImageData | null
    alt?: string
    full?: keyof typeof fullClassNames
  }
> = ({
  image,
  alt,
  className,
  full = 'width',
  classNames,
  sizes = DEFAULT_SIZES,
  ...imageProps
}) => {
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
      sizes={sizes}
      className={cn('object-cover', fullClassNames[full], className)}
      classNames={{
        ...classNames,
        wrapper: cn(fullClassNames[full], classNames?.wrapper),
      }}
      {...imageProps}
    />
  )
}
