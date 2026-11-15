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

// Same classes NextUI's <Image> used, so the look doesn't change.
const radiusClassNames = {
  none: 'rounded-none',
  sm: 'rounded-small',
  md: 'rounded-md',
  lg: 'rounded-large',
  full: 'rounded-full',
} as const satisfies Record<string, string>

const shadowClassNames = {
  none: 'shadow-none',
  sm: 'shadow-small',
  md: 'shadow-medium',
  lg: 'shadow-large',
} as const satisfies Record<string, string>

/**
 * Renders `next/image` directly. We used to wrap it in NextUI's `<Image>`, but
 * that component preloads the raw `src` with `new Image()` to track loading
 * state, which downloaded every original image from S3 (eagerly, ignoring
 * `loading="lazy"`) on top of the optimized one.
 */
export const OptimizedImage: FC<
  Omit<NextImageProps, 'src' | 'width' | 'height' | 'alt'> & {
    image?: S3Image | StaticImageData | null
    alt?: string
    full?: keyof typeof fullClassNames
    radius?: keyof typeof radiusClassNames
    shadow?: keyof typeof shadowClassNames
    classNames?: { wrapper?: string }
    isLoading?: boolean
  }
> = ({
  image,
  alt,
  className,
  full = 'width',
  radius = 'lg',
  shadow = 'none',
  classNames,
  isLoading,
  sizes = DEFAULT_SIZES,
  ...imageProps
}) => {
  const actualImage: StaticImage = image
    ? imageIsFromS3(image)
      ? imageToStatic(image)
      : image
    : { ...fallbackImage, alt: FALLBACK_IMG_ALT }

  return (
    <div
      className={cn(
        'relative shadow-black/5',
        radiusClassNames[radius],
        shadowClassNames[shadow],
        fullClassNames[full],
        isLoading && 'animate-pulse bg-content3',
        classNames?.wrapper
      )}
    >
      <NextImage
        src={actualImage.src}
        width={actualImage.width}
        height={actualImage.height}
        blurDataURL={actualImage.blurDataURL}
        alt={alt ?? actualImage.alt ?? ''}
        placeholder={actualImage.blurDataURL ? 'blur' : 'empty'}
        sizes={sizes}
        className={cn(
          'relative z-10 object-cover shadow-black/5',
          radiusClassNames[radius],
          shadowClassNames[shadow],
          fullClassNames[full],
          isLoading && 'opacity-0',
          className
        )}
        {...imageProps}
      />
    </div>
  )
}
