export function formatMoneyShort(n) {
  if (n == null || isNaN(n)) return '$0';
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);

  if (abs >= 1_000_000_000) {
    // billions with one decimal when needed
    const v = abs / 1_000_000_000;
    return `${sign}$${v >= 10 ? Math.round(v) : v.toFixed(1)}b`;
  }
  if (abs >= 1_000_000) {
    // millions with one decimal when needed
    const v = abs / 1_000_000;
    return `${sign}$${v >= 10 ? Math.round(v) : v.toFixed(1)}m`;
  }
  if (abs >= 1_000) {
    // thousands as whole k (e.g., 186000 -> 186k)
    const v = Math.round(abs / 1_000);
    return `${sign}$${v}k`;
  }
  return `${sign}$${abs}`;
}
