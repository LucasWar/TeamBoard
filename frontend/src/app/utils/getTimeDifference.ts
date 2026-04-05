export function getTimeDifference(date: Date | string): string {
  const now = new Date();

  const targetDate = new Date(date);

  const diffMs = now.getTime() - targetDate.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) {
    return `${minutes} minuto${minutes !== 1 ? "s" : ""}`;
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 24) {
    return `${hours} hora${hours !== 1 ? "s" : ""}`;
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 30) {
    return `${days} dia${days !== 1 ? "s" : ""}`;
  }

  const months = Math.floor(days / 30);
  return `${months} mês${months !== 1 ? "es" : ""}`;
}