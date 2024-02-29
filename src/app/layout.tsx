import { ReactNode } from 'react'
import ogImage from '../../public/og-image.png'

import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://begursecret.com'),

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

type Props = {
  children: ReactNode
}

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return children
}
