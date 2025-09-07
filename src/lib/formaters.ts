const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 0,
});

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

// Formats a number as USD currency (e.g., 1000 -> $1,000)
export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

// Formats a number with commas (e.g., 1000 -> 1,000)
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}
