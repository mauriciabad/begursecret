import { FC, PropsWithChildren } from 'react'
import ogImage from '../../public/ogimage.png'

import { Metadata } from 'next'
import { env } from '~/env.mjs'

const url =
  env.VERCEL_ENV === 'production'
    ? 'https://begursecret.com'
    : env.VERCEL_ENV === 'preview'
      ? `https://${env.VERCEL_URL}`
      : env.NODE_ENV === 'development'
        ? `http://localhost:${process.env.PORT || 3000}`
        : 'https://begursecret.com'

export const metadata: Metadata = {
  metadataBase: new URL(url),

  openGraph: {
    type: 'website',
    title: 'Begur Secret',
    siteName: 'Begur Secret',
    images: {
      url: ogImage.src,
      width: ogImage.width,
      height: ogImage.height,
      alt: '',
    },
  },
}

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return children
}

export default RootLayout
