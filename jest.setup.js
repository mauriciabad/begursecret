/* eslint-disable no-undef */
/// <reference types="@types/jest" />
/* eslint-env node */

import '@testing-library/jest-dom'

jest.mock('~/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => ({
    pathname: '',
  })),
}))
