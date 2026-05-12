export function formatDateBR(dateString: string, format?: number): string {
  const date = new Date(dateString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return format == 1 ? `${year}-${month}-${day}` : `${day}/${month}/${year}`
}