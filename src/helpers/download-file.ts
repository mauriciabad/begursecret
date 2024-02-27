export function download(
  content: string,
  filename: string,
  contentType: string = 'text/plain'
) {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
}
