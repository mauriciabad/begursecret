export const uploadImage = async <EndpointReturnType>({
  file,
  endpoint,
}: {
  file: File | null
  endpoint: `/api/upload/${string}`
}) => {
  const body = new FormData()

  if (file) body.set('image', file)

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
