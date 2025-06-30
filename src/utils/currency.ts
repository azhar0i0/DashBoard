
const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  PKR: '₨',
  INR: '₹'
};

export const formatCurrency = (
  amount: number | undefined | null,
  currency: string = 'USD'
): string => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '—';
  }

  const symbol = currencySymbols[currency] || '$';
  return `${symbol}${Number(amount).toLocaleString()}`;
};
  

export const getCurrencySymbol = (currency: string = 'USD'): string => {
  return currencySymbols[currency] || '$';
};
