export function formatDate(date: Date) {
  const day = date.getDate();

  const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short' });
  const month = monthFormatter.format(date);

  const timeFormatter = new Intl.DateTimeFormat('en', {
    timeStyle: 'short',
    timeZone: 'UTC',
  });
  const time = timeFormatter.format(date).toLocaleLowerCase();

  return `${day} ${month}, ${time} UTC`;
}

export function wait(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat('en', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    trailingZeroDisplay: 'stripIfInteger',
  }).format(n);
}
