export const uploadImage = async <EndpointReturnType>({
  file,
  alt,
  source,
  captureDate,
  endpoint,
}: {
  file: File | null
  alt?: string
  source?: string
  captureDate?: string
  endpoint: `/api/upload/${string}`
}) => {
  const body = new FormData()

  if (file) body.set('image', file)
  if (alt) body.set('alt', alt)
  if (source) body.set('source', source)
  if (captureDate) body.set('captureDate', captureDate)

  const response = await fetch(endpoint, {
    method: 'POST',
    body,
  })

  if (!response.ok) {
    throw new Error('Error uploading image')
  }

  const result: EndpointReturnType = await response.json()
  if (!result) throw new Error('Error uploading image')
  return result
}
