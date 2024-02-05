import * as NextIntlClient from '~/navigation'

export const mockUsePathname = ({
  pathname = '',
}: { pathname?: string } = {}) => {
  ;(NextIntlClient.usePathname as jest.Mock) = jest.fn(() => ({
    pathname,
  }))
}

export const mockUseRouter = () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }

  ;(NextIntlClient.useRouter as jest.Mock) = jest.fn(() => mockRouter)

  return mockRouter
}
