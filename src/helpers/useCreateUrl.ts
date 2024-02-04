import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { usePathname } from '~/navigation'

export function useCreateUrl() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const createUrlWithSearchParams = useCallback(
    (values: Record<string, string>, baseUrl?: string) => {
      const params = new URLSearchParams(searchParams)

      Object.entries(values).forEach(([key, value]) => params.set(key, value))

      return `${baseUrl ?? pathname}?${params.toString()}`
    },
    [searchParams, pathname]
  )

  return {
    createUrlWithSearchParams,
  }
}
