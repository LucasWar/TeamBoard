export function formatDateBR(dateString: string, format?: number): string {
  const [year, month, day] = dateString.slice(0, 10).split('-')

  return format === 1
    ? `${year}-${month}-${day}`
    : `${day}/${month}/${year}`
}
