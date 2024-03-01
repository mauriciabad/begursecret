import { redirect } from 'next/navigation'
import { FC } from 'react'
import { defaultLocale } from '~/i18n'

// This page only renders when the app is built statically (output: 'export')
const RootPage: FC = () => {
  return redirect(`/${defaultLocale}`)
}

export default RootPage
